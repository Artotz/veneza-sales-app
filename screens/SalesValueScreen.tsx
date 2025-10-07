import { useEffect, useMemo, useRef, useState } from 'react';
import { View, TextInput, Text, Animated, Easing, Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from 'components/Header';
import machineData from '../utils/consumptionPerMachine'; // lista família/modelo

// ==============================
// Tipos
// ==============================
type UF = 'CE' | 'PE' | 'PI' | '';

// ==============================
// Constantes (fictício até integrar BD)
// ==============================
const priceData: Record<string, Record<string, number>> = {
  'backhoe loaders': { '310P': 385000 },
  'wheel loaders': {
    '444G': 620000,
    '524P': 690000,
    '544P': 740000,
    '624P': 815000,
    '644P': 885000,
    '724P': 940000,
  },
  'motor graders': {
    '620P': 980000,
    '622P': 1010000,
    '670P': 1080000,
    '672P': 1115000,
    '770P': 1190000,
    '772P': 1220000,
  },
  'crawler dozers': {
    '700J-II': 815000,
    '750J-II': 895000,
    '850J-II': 1090000,
    '1050P': 1380000,
  },
  excavators: {
    '130P': 720000,
    '160P': 790000,
    '200G': 850000,
    '210P': 895000,
    '250P': 970000,
    '350P': 1180000,
  },
};

// Alíquotas simplificadas
const INTERNAL_RATE_BY_UF: Record<UF, number> = { CE: 0.18, PE: 0.18, PI: 0.18, '': 0 };
const INTERSTATE_RATE = 0.12;

// ==============================
// Helpers (fora do componente)
// ==============================
const money = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

const formatBRNoSymbol = (n: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const toNumber = (s: string) => {
  // aceita "1.234,56" ou "1234.56"
  const normalized = s
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^0-9.-]/g, '');
  const val = parseFloat(normalized);
  return isNaN(val) ? 0 : val;
};

// ==============================
// Componente
// ==============================
export default function SalesPriceScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  // ---------- Estados de entrada ----------
  const [family, setFamily] = useState('');
  const [model, setModel] = useState('');
  const [ufClient, setUfClient] = useState<UF>('');
  const [ufBilling, setUfBilling] = useState<UF>('');
  const [freight, setFreight] = useState(''); // R$
  const [flatFee, setFlatFee] = useState(''); // %

  // ---------- Derivados simples ----------
  const basePrice = family && model && priceData?.[family]?.[model] ? priceData[family][model] : 0;

  const freightValue = freight ? parseFloat(freight) : 0;
  const flatPct = flatFee ? parseFloat(flatFee) : 0;

  // ---------- Cálculo principal ----------
  const { subtotal, icmsEstimated, total } = useMemo(() => {
    const flatValue = basePrice * (flatPct / 100);
    const sub = basePrice + freightValue + flatValue;

    const destRate = INTERNAL_RATE_BY_UF[ufClient] || 0;
    const sameUF = ufClient && ufBilling && ufClient === ufBilling;

    let icms = 0;
    if (ufClient && ufBilling) {
      if (sameUF) {
        icms = sub * destRate;
      } else {
        const difal = Math.max(destRate - INTERSTATE_RATE, 0);
        icms = sub * (INTERSTATE_RATE + difal);
      }
    }

    return { subtotal: sub, icmsEstimated: icms, total: sub + icms };
  }, [basePrice, freightValue, flatPct, ufClient, ufBilling]);

  const computedTotal = isFinite(total) ? total : 0;

  // ---------- Override manual ----------
  const [manualTotal, setManualTotal] = useState<string>(''); // string formatada pt-BR (sem "R$")
  const [isManualOverride, setIsManualOverride] = useState(false);

  // Sincroniza input com total calculado quando NÃO há override
  useEffect(() => {
    if (!isManualOverride) {
      setManualTotal(formatBRNoSymbol(computedTotal));
    }
  }, [computedTotal, isManualOverride]);

  // Qualquer mudança de insumo cancela override e volta ao automático
  useEffect(() => {
    if (isManualOverride) {
      setIsManualOverride(false);
      setManualTotal(formatBRNoSymbol(computedTotal));
    }
  }, [family, model, ufClient, ufBilling, freight, flatFee]);

  const manualAsNumber = toNumber(manualTotal);
  const delta = manualAsNumber - computedTotal;

  const DRAWER_MIN = 36; // altura fechada (cabeçalho)
  const DRAWER_MAX = 260; // altura aberta (conteúdo)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerAnim = useRef(new Animated.Value(0)).current; // 0 fechado, 1 aberto

  const drawerTranslateY = drawerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [DRAWER_MAX - DRAWER_MIN, 0], // desliza de baixo p/ cima
  });

  const toggleDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: isDrawerOpen ? 0 : 1,
      duration: 220,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => setIsDrawerOpen((v) => !v));
  };

  // ==============================
  // UI
  // ==============================
  return (
    <View
      className="flex-1 bg-black"
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <View className="flex-1 bg-[#231f1e]/70">
        <Header navigation={navigation} title="Valor de Venda" />

        {/* Cabeçalho com campo editável do total */}
        <View className="flex-row items-center rounded-2xl p-4">
          <View style={{ flex: 1 }}>
            <Text className="text-lg font-bold uppercase text-yellow-400">Valor Total (R$)</Text>

            <TextInput
              className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-4xl font-extrabold tracking-wide text-white"
              keyboardType="numbers-and-punctuation"
              value={manualTotal}
              onChangeText={(txt) => {
                const cleaned = txt.replace(/[^\d.,-]/g, ''); // mantém pontos e vírgula
                setManualTotal(cleaned);
                if (!isManualOverride) setIsManualOverride(true);
              }}
              placeholder={formatBRNoSymbol(0)}
              placeholderTextColor="#9ca3af"
            />

            {/* Linha auxiliar mostrando cálculo e delta */}
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="text-xs text-white/70">Calculado: {money(computedTotal)}</Text>

              {isManualOverride && delta !== 0 ? (
                <Text
                  className={`text-xs font-bold ${delta < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {delta < 0 ? 'Desconto aplicado' : 'Ajuste acrescido'}: {money(Math.abs(delta))}
                </Text>
              ) : null}
            </View>

            {/* Ação rápida */}
            {isManualOverride ? (
              <View className="mt-2 flex-row gap-2">
                <Text
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white"
                  onPress={() => {
                    setIsManualOverride(false);
                    setManualTotal(formatBRNoSymbol(computedTotal));
                  }}>
                  Usar valor calculado
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <ScrollView className="flex-1 p-4 pb-72">
          {/* Família */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">Família</Text>
            <View className="overflow-hidden rounded-xl">
              <Picker
                selectedValue={family}
                onValueChange={(val) => {
                  setFamily(val);
                  setModel('');
                }}
                style={{
                  color: '#231f1e',
                  backgroundColor: 'white',
                  fontSize: 16,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                }}>
                <Picker.Item label="Selecione a família" value="" />
                {Object.keys(machineData).map((fam) => (
                  <Picker.Item key={fam} label={fam} value={fam} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Modelo */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">Modelo</Text>
            <View className="overflow-hidden rounded-xl">
              <Picker
                selectedValue={model}
                enabled={!!family}
                onValueChange={(val) => setModel(val)}
                style={{
                  color: '#231f1e',
                  backgroundColor: 'white',
                  fontSize: 16,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
                }}>
                <Picker.Item label="Selecione o produto" value="" />
                {family &&
                  Object.keys((machineData as any)[family]).map((mod) => (
                    <Picker.Item key={mod} label={mod} value={mod} />
                  ))}
              </Picker>
            </View>
          </View>

          {/* Preço base (BD futuramente) */}
          {/* <View className="mb-4 gap-2 rounded-2xl bg-black p-4">
            <Text className="font-bold text-white">Preço base (modelo)</Text>
            <Text className="text-white">{basePrice ? money(basePrice) : '-'}</Text>
          </View> */}

          {/* UFs (cliente e faturamento) lado a lado */}
          <View className="mb-4 flex-row gap-3">
            {/* UF do Cliente */}
            <View className="flex-1 gap-2 rounded-2xl bg-yellow-400 p-4">
              <Text className="font-bold text-black">UF do cliente</Text>
              <View className="overflow-hidden rounded-xl">
                <Picker
                  selectedValue={ufClient}
                  onValueChange={(val) => setUfClient(val)}
                  style={{
                    color: '#231f1e',
                    backgroundColor: 'white',
                    fontSize: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                  }}>
                  <Picker.Item label="UF" value="" />
                  <Picker.Item label="CE" value="CE" />
                  <Picker.Item label="PE" value="PE" />
                  <Picker.Item label="PI" value="PI" />
                </Picker>
              </View>
            </View>

            {/* UF de Faturamento */}
            <View className="flex-1 gap-2 rounded-2xl bg-yellow-400 p-4">
              <Text className="font-bold text-black">UF de faturamento</Text>
              <View className="overflow-hidden rounded-xl">
                <Picker
                  selectedValue={ufBilling}
                  onValueChange={(val) => setUfBilling(val)}
                  style={{
                    color: '#231f1e',
                    backgroundColor: 'white',
                    fontSize: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 8,
                  }}>
                  <Picker.Item label="UF" value="" />
                  <Picker.Item label="CE" value="CE" />
                  <Picker.Item label="PE" value="PE" />
                  <Picker.Item label="PI" value="PI" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Frete (R$) */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">Frete (R$)</Text>
            <TextInput
              className="rounded-xl bg-white p-2"
              keyboardType="decimal-pad"
              value={freight}
              onChangeText={(text) => {
                const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                setFreight(normalized);
              }}
              placeholder="0,00"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Taxa flat (%) */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">Taxa flat (%)</Text>
            <TextInput
              className="rounded-xl bg-white p-2"
              keyboardType="decimal-pad"
              value={flatFee}
              onChangeText={(text) => {
                const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                setFlatFee(normalized);
              }}
              placeholder="0,00"
              placeholderTextColor="#9ca3af"
            />
          </View>
        </ScrollView>

        {/* Drawer de Resumo (fixo no rodapé) */}
        <Animated.View
          style={{
            position: 'absolute',
            left: 16,
            right: 16,
            bottom: 16,
            transform: [{ translateY: drawerTranslateY }],
            height: DRAWER_MAX,
            backgroundColor: 'black',
            borderRadius: 16,
          }}>
          {/* Cabeçalho do drawer (sempre visível) */}
          <Pressable onPress={toggleDrawer}>
            <View className="px-4">
              {/* “handle” */}
              <View className="mx-auto mb-2 h-1 w-10 rounded-full" />
              <View className="flex-row items-center justify-center">
                <Text className="text-lg font-bold text-white/80">Detalhes</Text>
              </View>
            </View>
          </Pressable>

          {/* Conteúdo do drawer (mostra quando aberto) */}
          <View className="mt-3 border-t border-white/10 px-4 py-3">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm font-bold text-white/80">Resumo</Text>
              <Text className="text-base font-extrabold text-white">
                {money(isFinite(total) ? total : 0)}
              </Text>
            </View>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-white/70">Subtotal</Text>
              <Text className="text-white">{money(isFinite(subtotal) ? subtotal : 0)}</Text>
            </View>
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-white/70">ICMS estimado</Text>
              <Text className="text-white">
                {money(isFinite(icmsEstimated) ? icmsEstimated : 0)}
              </Text>
            </View>

            {/* Se estiver em override, mostra a diferença aqui também (opcional) */}
            {isManualOverride && delta !== 0 ? (
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-white/70">
                  {delta < 0 ? 'Desconto aplicado' : 'Ajuste acrescido'}
                </Text>
                <Text className={`${delta < 0 ? 'text-green-400' : 'text-red-400'} font-bold`}>
                  {money(Math.abs(delta))}
                </Text>
              </View>
            ) : null}

            <Text className="mt-2 text-[11px] leading-4 text-white/50">
              *Cálculo de ICMS simplificado para CE/PE/PI, apenas para referência. Ajuste quando
              integrar regras fiscais reais (DIFAL, FCP, contribuinte final, base “por dentro”,
              etc.).
            </Text>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
