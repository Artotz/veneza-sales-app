import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import '../utils/fields';
import Header from 'components/Header';
import { Feather } from '@expo/vector-icons';
import machineData from '../utils/consumptionPerMachine';

export default function SalesValueScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const [family, setFamily] = useState('');
  const [model, setModel] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [diesel, setDiesel] = useState('');
  const [hours, setHours] = useState('');

  const ourConsumption = family && model ? (machineData as any)[family][model] : 0;

  const economy =
    competitor && diesel && hours
      ? (parseFloat(competitor) - ourConsumption) * parseFloat(diesel) * parseFloat(hours)
      : 0;

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
        <Header navigation={navigation} title={t('LDV.title')} />

        <View className="flex-row items-center rounded-2xl p-4">
          {/* Imagem */}
          <Image
            source={require('../assets/ldvlogo.png')}
            style={{
              flex: 1,
              height: 140,
              borderRadius: 12,
              resizeMode: 'contain',
              marginRight: 12,
            }}
          />

          {/* Texto */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text className="text-lg font-bold uppercase text-yellow-400">{t('LDV.economy')}</Text>
            <Text className="mt-2 text-4xl font-extrabold tracking-wide text-white">
              {new Intl.NumberFormat('pt-BR', {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(economy)}
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Família */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">{t('LDV.family')}</Text>
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
                <Picker.Item
                  label={t('LDV.selectFamily')}
                  value=""
                  style={{ backgroundColor: '#660000' }}
                />
                {Object.keys(machineData).map((fam) => (
                  <Picker.Item key={fam} label={t('LDV.' + fam)} value={fam} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Produto */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">{t('LDV.product')}</Text>
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
                <Picker.Item label={t('LDV.selectProduct')} value="" />
                {family &&
                  Object.keys((machineData as any)[family]).map((mod) => (
                    <Picker.Item key={mod} label={mod} value={mod} />
                  ))}
              </Picker>
            </View>
          </View>

          {/* Nosso Consumo */}
          <View className="mb-4 gap-2 rounded-2xl bg-black p-4">
            <Text className="font-bold text-white">{t('LDV.ourConsumption')}</Text>
            <Text className="text-white">{ourConsumption || '-'}</Text>
          </View>

          {/* Concorrência */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">{t('LDV.competitorConsumption')}</Text>
            <TextInput
              className="rounded-xl bg-white p-2"
              keyboardType="decimal-pad"
              value={competitor}
              onChangeText={(text) => {
                // Substitui vírgula por ponto e mantém apenas números e ponto
                const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                setCompetitor(normalized);
              }}
            />
          </View>

          {/* Diesel */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">{t('LDV.dieselPrice')}</Text>
            <TextInput
              className="rounded-xl bg-white p-2"
              keyboardType="decimal-pad"
              value={diesel}
              onChangeText={(text) => {
                const normalized = text.replace(',', '.').replace(/[^0-9.]/g, '');
                setDiesel(normalized);
              }}
            />
          </View>

          {/* Horas */}
          <View className="mb-4 gap-2 rounded-2xl bg-yellow-400 p-4">
            <Text className="font-bold text-black">{t('LDV.monthlyHours')}</Text>
            <TextInput
              className="rounded-xl bg-white p-2"
              keyboardType="numeric"
              value={hours}
              onChangeText={setHours}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
