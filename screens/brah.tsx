import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import machineData from '../utils/consumptionPerMachine'; // seu objeto export default

export default function LDVScreen() {
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
    <View className="flex-1 bg-black p-4">
      {/* Família */}
      <View className="mb-4 rounded-2xl bg-yellow-400 p-4">
        <Text className="font-bold text-black">Family</Text>
        <Picker
          selectedValue={family}
          onValueChange={(val) => {
            setFamily(val);
            setModel('');
          }}>
          <Picker.Item label="Select family" value="" />
          {Object.keys(machineData).map((fam) => (
            <Picker.Item key={fam} label={fam} value={fam} />
          ))}
        </Picker>
      </View>

      {/* Produto */}
      <View className="mb-4 rounded-2xl bg-yellow-400 p-4">
        <Text className="font-bold text-black">Product</Text>
        <Picker selectedValue={model} enabled={!!family} onValueChange={(val) => setModel(val)}>
          <Picker.Item label="Select product" value="" />
          {family &&
            Object.keys((machineData as any)[family]).map((mod) => (
              <Picker.Item key={mod} label={mod} value={mod} />
            ))}
        </Picker>
      </View>

      {/* Nosso Consumo */}
      <View className="mb-4 rounded-2xl bg-black p-4">
        <Text className="font-bold text-white">Our Consumption (L/h)</Text>
        <Text className="text-white">{ourConsumption || '-'}</Text>
      </View>

      {/* Concorrência */}
      <View className="mb-4 rounded-2xl bg-yellow-400 p-4">
        <Text className="font-bold text-black">Competitor Consumption (L/h)</Text>
        <TextInput
          className="rounded-xl bg-white p-2"
          keyboardType="numeric"
          value={competitor}
          onChangeText={setCompetitor}
        />
      </View>

      {/* Diesel */}
      <View className="mb-4 rounded-2xl bg-yellow-400 p-4">
        <Text className="font-bold text-black">Diesel Price (R$)</Text>
        <TextInput
          className="rounded-xl bg-white p-2"
          keyboardType="numeric"
          value={diesel}
          onChangeText={setDiesel}
        />
      </View>

      {/* Horas */}
      <View className="mb-4 rounded-2xl bg-yellow-400 p-4">
        <Text className="font-bold text-black">Monthly Hours</Text>
        <TextInput
          className="rounded-xl bg-white p-2"
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />
      </View>

      {/* Economia */}
      <View className="mb-4 rounded-2xl bg-black p-4">
        <Text className="font-bold text-white">Economy (R$)</Text>
        <Text className="text-white">{economy > 0 ? `R$ ${economy.toFixed(2)}` : '-'}</Text>
      </View>
    </View>
  );
}
