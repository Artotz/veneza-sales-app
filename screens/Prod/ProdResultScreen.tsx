import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  findNodeHandle,
  UIManager,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { Outputs } from 'utils/calculator';
import Feather from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Header from 'components/Header';

const casasDecimais: Record<keyof Outputs, number> = {
  effectiveVolume: 3,
  effectiveMass: 3,
  loadedVolume: 3,
  loadedMass: 3,
  tripsPerHour: 2,
  volumePerHour: 3,
  weightPerHour: 3,
  efficiency: 3,
  costPerHour: 2,
  costPerDay: 2,
  costPerMonth: 2,
  costPerM3: 2,
  costPerTonPerHour: 2,
};

export default function ProdResultScreen({ navigation, route }: any) {
  const output: Outputs = route.params;

  const insets = useSafeAreaInsets();

  const scrollRef = useRef<ScrollView>(null);
  const [tooltipKey, setTooltipKey] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const { t } = useTranslation();

  const handlePressInfo = (ref: any, key: string | null) => {
    if (!ref) return;

    if (Platform.OS === 'web') {
      const rect = ref.getBoundingClientRect();

      const scrollContainer = scrollRef.current as unknown as HTMLDivElement;
      const containerRect = scrollContainer.getBoundingClientRect();

      // posição relativa ao container + scroll interno
      const offsetX = rect.left - containerRect.left + scrollContainer.scrollLeft;
      const offsetY = rect.top - containerRect.top + scrollContainer.scrollTop;

      setTooltipPos({ x: offsetX, y: offsetY + rect.height });
      setTooltipKey(key);
    } else {
      // MOBILE → usa findNodeHandle + UIManager
      const handle = findNodeHandle(ref);
      if (!handle) return;

      UIManager.measureLayout(
        handle,
        findNodeHandle(scrollRef.current) as number,
        () => {},
        (x, y, w, h) => {
          setTooltipPos({ x, y: y + h }); // logo abaixo
          setTooltipKey(key);
        }
      );
    }
  };

  return (
    <View
      className="flex-1 bg-black"
      style={{
        flex: 1,
        paddingTop: insets.top, // status bar
        paddingBottom: insets.bottom, // gesture bar ou actions bar
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-[#231f1e]/70 p-4"
        onScrollBeginDrag={() => setTooltipKey(null)}
        onScroll={() => setTooltipKey(null)}
        scrollEventThrottle={16}>
        <Header navigation={navigation} title={t('prodResult.title')} />
        {Object.entries(output).map(([key, valor], index) => {
          let infoButtonRef: any = null;

          return (
            <View key={index} className="mb-4 flex rounded-2xl bg-white p-5 shadow-lg">
              {/* Faixa amarela */}
              <View className="absolute left-0 top-0 h-2 w-full rounded-t-2xl bg-[#ffde2d]" />

              {/* Cabeçalho com info */}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium text-gray-500">
                  {t('prodResult.outputFields.' + key + '.label')}
                </Text>
                <TouchableOpacity
                  ref={(r) => {
                    infoButtonRef = r;
                  }}
                  onPress={() => handlePressInfo(infoButtonRef, key === tooltipKey ? null : key)}>
                  <Feather name="info" size={22} color="#231f1e" />
                </TouchableOpacity>
              </View>
              <Text className="mt-1 text-xl font-bold text-[#231f1e]">
                {valor.toLocaleString('pt-BR', {
                  minimumFractionDigits: casasDecimais[key as keyof Outputs],
                  maximumFractionDigits: casasDecimais[key as keyof Outputs],
                })}{' '}
                {t(`prodResult.outputFields.${key}.unit`) ?? ''}
              </Text>
            </View>
          );
        })}

        <View className="flex h-[50vh] w-full" />

        {/* Tooltip */}
        {tooltipKey && tooltipPos && (
          <TouchableWithoutFeedback onPress={() => setTooltipKey(null)}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 999,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: tooltipPos.y - 10,
                  left: tooltipPos.x - 194,
                  width: 220,
                  backgroundColor: '#231f1e',
                  padding: 10,
                  borderRadius: 8,
                  elevation: 20,
                }}
                // 🔑 Isso faz o clique "passar" pelo tooltip e não disparar o onPress do overlay
                pointerEvents="box-none">
                <Text style={{ color: '#ffde2d', fontSize: 12 }}>
                  {t(`prodResult.outputFields.${tooltipKey}.tooltip`)}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
      </ScrollView>
    </View>
  );
}
