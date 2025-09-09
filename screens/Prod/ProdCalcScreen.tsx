import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  // ImageBackground,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { calcularSaidas, Inputs } from 'utils/calculator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { inputFields, densityOptions } from '../../utils/fields';
import Header from 'components/Header';
import { Feather } from '@expo/vector-icons';
import TimerModal from './Modal/TimerModal';

export default function ProdCalcScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const [values, setValues] = useState<Record<string, string>>({});
  const [erro, setErro] = useState(true);

  //MODAL DENSITY
  const [showDensityModal, setShowDensityModal] = useState(false);
  const [modalMass, setModalMass] = useState('');
  const [modalVolume, setModalVolume] = useState('');
  const [modalDensity, setModalDensity] = useState('');

  // MODAL FILL FACTOR
  const [showFillFactorModal, setShowFillFactorModal] = useState(false);
  const [truckFull, setTruckFull] = useState('');
  const [truckEmpty, setTruckEmpty] = useState('');
  const [densityFF, setDensityFF] = useState('');
  const [cycle, setCycle] = useState('');
  const [bucket, setBucket] = useState('');
  const [fillFactor, setFillFactor] = useState('');

  const [showTimerModal, setShowTimerModal] = useState(false);

  const { t } = useTranslation();

  // carregar do AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('inputs');
        if (saved) setValues(JSON.parse(saved));
      } catch (e) {
        console.log('Erro ao carregar dados salvos', e);
      }
    })();
  }, []);

  // salvar no AsyncStorage sempre que mudar
  useEffect(() => {
    AsyncStorage.setItem('inputs', JSON.stringify(values)).catch((e) =>
      console.log('Erro ao salvar', e)
    );

    const algumVazio = inputFields.some((c) => !values[c]);
    setErro(algumVazio);
  }, [values]);

  function handleChange(key: string, text: string) {
    setValues((prev) => ({ ...prev, [key]: text }));
  }

  function handleSubmit() {
    const parsedInputs = Object.fromEntries(
      inputFields.map((c) => [c, parseFloat(values[c].replace(',', '.'))])
    );

    console.log(values['materialDensity']);

    navigation.navigate('ProdResult', calcularSaidas(parsedInputs as Inputs));
  }

  const clearKey = async () => {
    setValues({});
    try {
      await AsyncStorage.removeItem('inputs');
    } catch (error) {
      console.error('Erro ao remover chave', error);
    }
  };

  function validateNumbers(...args: (string | number)[]): boolean {
    return args.some((arg) => {
      const value = typeof arg === 'string' ? arg.trim() : arg;
      return value === '' || isNaN(Number(value)) || Number(value) <= 0;
    });
  }

  function openFillFactorModal() {
    setTruckFull('');
    setTruckEmpty('');
    setDensityFF(values['materialDensity'] ?? '');
    setCycle(values['cycleCount'] ?? '');
    setBucket(values['bucketCapacity'] ?? '');

    setShowFillFactorModal(true);
  }

  function calculateFillFactor() {
    const cheio = parseFloat(truckFull.replace(',', '.'));
    const vazio = parseFloat(truckEmpty.replace(',', '.'));
    const dens = parseFloat(densityFF.replace(',', '.'));
    const ciclos = parseFloat(cycle.replace(',', '.'));
    const cacamba = parseFloat(bucket.replace(',', '.'));

    if (validateNumbers(cheio, vazio, dens, ciclos, cacamba)) {
      return;
    }

    const pesoMaterial = cheio - vazio;
    const valor1 = pesoMaterial / dens;
    const ff = valor1 / ciclos / cacamba;

    setFillFactor((ff * 100).toFixed(0));
  }

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
      <View className="flex-1 bg-[#231f1e]/70">
        <ScrollView className="flex-1 p-4">
          <Header navigation={navigation} title={t('prodCalc.title')} />
          {inputFields.map((field) =>
            field === 'materialDensity' || field === 'fillFactor' ? (
              field === 'fillFactor' ? (
                // FILLFACTOR --------------------------------------------------------
                <View
                  key={field}
                  className="mb-4 rounded-2xl border border-[#ffde2d] bg-white p-4 shadow-lg">
                  <View className="mb-2 flex-row items-center justify-between ">
                    <Text className="text-sm font-semibold text-[#231f1e]">
                      {t(`prodCalc.inputFields.${field}`)}
                    </Text>
                    <TouchableOpacity onPress={() => openFillFactorModal()}>
                      <Feather name="edit" size={22} color="#231f1e" />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    className="rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                    placeholder={t(`prodCalc.inputFields.${field}`)}
                    placeholderTextColor="#888"
                    value={values[field] ?? ''}
                    onChangeText={(text) => handleChange(field, text)}
                    keyboardType="numeric"
                  />
                </View>
              ) : (
                // MATERIALDENSITY ---------------------------------------------------
                <View
                  key={field}
                  className="mb-4 rounded-2xl border border-[#ffde2d] bg-white p-4 shadow-lg">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="text-sm font-semibold text-[#231f1e]">
                      {t(`prodCalc.inputFields.${field}`)}
                    </Text>
                    <TouchableOpacity onPress={() => setShowDensityModal(true)}>
                      <Feather name="edit" size={22} color="#231f1e" />
                    </TouchableOpacity>
                  </View>
                  <View className="overflow-hidden rounded-xl border border-gray-300 bg-gray-50">
                    <Picker
                      selectedValue={values[field] ?? ''}
                      onValueChange={(value) => handleChange(field, value)}
                      dropdownIconColor="#231f1e"
                      style={{
                        color: '#231f1e', // cor do texto
                        backgroundColor: 'transparent',
                        fontSize: 16,
                        paddingHorizontal: 8,
                        // paddingVertical: 6,
                      }}>
                      <Picker.Item label={t('prodCalc.selectDensity')} value="" />

                      {values['customMaterialDensity'] && (
                        <Picker.Item
                          key={-1}
                          label={`${t('prodCalc.customDensity')} (${values['customMaterialDensity']})`}
                          value={values['customMaterialDensity']}
                        />
                      )}

                      {densityOptions.map((opcao, idx) => (
                        <Picker.Item
                          key={idx}
                          label={`${t('prodCalc.densityOptions.' + opcao.key)} (${opcao.valor})`}
                          value={opcao.valor.toString()}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
              )
            ) : (
              // ELSE ----------------------------------------------------------------
              <View
                key={field}
                className="mb-4 rounded-2xl border border-[#ffde2d] bg-white p-4 shadow-lg">
                <View className="mb-2 flex-row items-center justify-between ">
                  <Text className="text-sm font-semibold text-[#231f1e]">
                    {t(`prodCalc.inputFields.${field}`)}
                  </Text>
                  {field === 'totalTime' && (
                    <TouchableOpacity onPress={() => setShowTimerModal(true)}>
                      <Feather name="edit" size={22} color="#231f1e" />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  className="rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                  placeholder={t(`prodCalc.inputFields.${field}`)}
                  placeholderTextColor="#888"
                  value={values[field] ?? ''}
                  onChangeText={(text) => handleChange(field, text)}
                  keyboardType="numeric"
                />
              </View>
            )
          )}

          <View className="flex h-[30vh] w-full" />
        </ScrollView>

        <View className="flex p-4">
          <TouchableOpacity
            disabled={erro}
            onPress={handleSubmit}
            className={`mt-2 rounded-2xl p-4 ${erro ? 'bg-gray-400' : 'bg-[#ffde2d]'}`}>
            <Text
              className={`text-center text-lg font-bold ${
                erro ? 'text-gray-700' : 'text-[#231f1e]'
              }`}>
              {t('prodCalc.calculate')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearKey}
            className="mt-3 rounded-2xl border border-[#ffde2d] bg-[#231f1e] p-4">
            <Text className="text-center text-lg font-bold text-[#ffde2d]">
              {t('prodCalc.clearAll')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ----------------------------------------------------- */}
      {/* ------------------ MODAL DENSITY -------------------- */}
      {/* ----------------------------------------------------- */}

      <Modal
        visible={showDensityModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDensityModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowDensityModal(false)}>
          <View className="flex-1 items-center justify-center bg-black/60">
            <TouchableWithoutFeedback>
              <View className="w-11/12 rounded-2xl bg-white p-6">
                <View className="flex-row justify-between">
                  <Text className="mb-4 text-lg font-bold text-[#231f1e]">
                    {t('prodCalc.customDensityModal.title')}
                  </Text>
                  {/* <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('Credits');
                }}>
                <Feather name="info" size={22} color="#ffde2d" />
              </TouchableOpacity> */}
                </View>

                <View className="flex-row gap-8">
                  <View className="flex-1">
                    <Text className="mb-2 flex text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customDensityModal.mass')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      placeholder={t('prodCalc.customDensityModal.mass')}
                      keyboardType="numeric"
                      onChangeText={setModalMass}
                      value={modalMass}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="mb-2 flex text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customDensityModal.volume')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      placeholder={t('prodCalc.customDensityModal.volume')}
                      keyboardType="numeric"
                      onChangeText={setModalVolume}
                      value={modalVolume}
                    />
                  </View>
                </View>

                {/* Botão calcular */}
                <TouchableOpacity
                  disabled={validateNumbers(modalMass, modalVolume)}
                  onPress={() => {
                    const m = parseFloat(modalMass.replace(',', '.') || '0');
                    const v = parseFloat(modalVolume.replace(',', '.') || '0');
                    if (m > 0 && v > 0) setModalDensity((m / v).toFixed(0));
                  }}
                  className={`mt-2 rounded-2xl p-4 ${
                    validateNumbers(modalMass, modalVolume) ? 'bg-gray-400' : 'bg-[#ffde2d]'
                  }`}>
                  <Text
                    className={`text-center font-bold ${
                      validateNumbers(modalMass, modalVolume) ? 'text-gray-700' : 'text-[#231f1e]'
                    }`}>
                    {t('prodCalc.customDensityModal.calculate')}
                  </Text>
                </TouchableOpacity>

                <Text className="mb-2 mt-8 text-sm font-semibold text-[#231f1e]">
                  {t('prodCalc.customDensityModal.density')}
                </Text>
                <TextInput
                  className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                  placeholder={t('prodCalc.customDensityModal.density')}
                  keyboardType="numeric"
                  onChangeText={setModalDensity}
                  value={modalDensity}
                />

                <View className="mt-4 flex-row justify-center gap-8">
                  {/* Botão cancelar */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowDensityModal(false);
                      setModalMass('');
                      setModalVolume('');
                      setModalDensity('');
                    }}
                    className="rounded-full border border-[#ffde2d] bg-[#231f1e] p-4">
                    <Feather name="x" size={28} color="#ffde2d" />
                  </TouchableOpacity>

                  {/* Botão calcular */}
                  <TouchableOpacity
                    disabled={validateNumbers(modalDensity)}
                    onPress={() => {
                      setValues((prev) => ({
                        ...prev,
                        customMaterialDensity: modalDensity,
                        materialDensity: modalDensity,
                      }));
                      setShowDensityModal(false);
                      setModalMass('');
                      setModalVolume('');
                      setModalDensity('');
                    }}
                    className={`rounded-full p-4 ${
                      validateNumbers(modalDensity) ? 'bg-gray-400' : 'bg-[#ffde2d]'
                    }`}>
                    <Feather
                      name="check"
                      size={28}
                      color={validateNumbers(modalDensity) ? '#7c7c7c' : '#231f1e'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ----------------------------------------------------- */}
      {/* ---------------- MODAL FILL FACTOR ------------------ */}
      {/* ----------------------------------------------------- */}

      <Modal
        visible={showFillFactorModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFillFactorModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowFillFactorModal(false)}>
          <View className="flex-1 items-center justify-center bg-black/60">
            <TouchableWithoutFeedback>
              <View className="w-11/12 rounded-2xl bg-white p-6">
                <View className="flex-row justify-between">
                  <Text className="mb-4 text-lg font-bold text-[#231f1e]">
                    {t('prodCalc.customFillFactorModal.title')}
                  </Text>
                  {/* <TouchableOpacity
                onPress={() => {
                  // navigation.navigate('Credits');
                }}>
                <Feather name="info" size={22} color="#ffde2d" />
              </TouchableOpacity> */}
                </View>

                <View className="flex-row items-end gap-4">
                  {/* TRUCK FULL */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customFillFactorModal.truckFull')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      keyboardType="numeric"
                      value={truckFull}
                      onChangeText={setTruckFull}
                    />
                  </View>

                  {/* TRUCK EMPTY */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customFillFactorModal.truckEmpty')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      keyboardType="numeric"
                      value={truckEmpty}
                      onChangeText={setTruckEmpty}
                    />
                  </View>
                </View>

                <View className="flex-row items-end gap-4">
                  {/* DENSITY */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customFillFactorModal.density')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      keyboardType="numeric"
                      value={densityFF}
                      onChangeText={setDensityFF}
                    />
                  </View>

                  {/* CYCLE */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customFillFactorModal.cycle')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      keyboardType="numeric"
                      value={cycle}
                      onChangeText={setCycle}
                    />
                  </View>

                  {/* BUCKET */}
                  <View className="flex-1">
                    <Text className="mb-2 text-sm font-semibold text-[#231f1e]">
                      {t('prodCalc.customFillFactorModal.bucket')}
                    </Text>
                    <TextInput
                      className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                      keyboardType="numeric"
                      value={bucket}
                      onChangeText={setBucket}
                    />
                  </View>
                </View>

                {/* Botão calcular */}
                <TouchableOpacity
                  disabled={validateNumbers(truckFull, truckEmpty, densityFF, cycle, bucket)}
                  onPress={calculateFillFactor}
                  className={`mt-2 rounded-2xl p-4 ${
                    validateNumbers(truckFull, truckEmpty, densityFF, cycle, bucket)
                      ? 'bg-gray-400'
                      : 'bg-[#ffde2d]'
                  }`}>
                  <Text
                    className={`text-center font-bold ${
                      validateNumbers(truckFull, truckEmpty, densityFF, cycle, bucket)
                        ? 'text-gray-700'
                        : 'text-[#231f1e]'
                    }`}>
                    {t('prodCalc.customFillFactorModal.calculate')}
                  </Text>
                </TouchableOpacity>

                {/* Resultado */}
                <Text className="mb-2 mt-4 text-sm font-semibold text-[#231f1e]">
                  {t('prodCalc.customFillFactorModal.result')}
                </Text>
                <TextInput
                  className="mb-4 rounded-xl border border-gray-300 bg-gray-50 p-3 text-[#231f1e]"
                  keyboardType="numeric"
                  value={fillFactor}
                  onChangeText={setFillFactor}
                />

                {/* Botões */}

                <View className="mt-4 flex-row justify-center gap-8">
                  {/* CANCEL */}
                  <TouchableOpacity
                    onPress={() => {
                      setShowFillFactorModal(false);
                      setTruckFull('');
                      setTruckEmpty('');
                      setDensityFF('');
                      setCycle('');
                      setBucket('');
                      setFillFactor('');
                    }}
                    className="rounded-full border border-[#ffde2d] bg-[#231f1e] p-4">
                    <Feather name="x" size={28} color="#ffde2d" />
                  </TouchableOpacity>

                  {/* CONFIRM */}
                  <TouchableOpacity
                    onPress={() => {
                      setValues((prev) => ({
                        ...prev,
                        fillFactor: fillFactor,
                      }));
                      setShowFillFactorModal(false);
                      setTruckFull('');
                      setTruckEmpty('');
                      setDensityFF('');
                      setCycle('');
                      setBucket('');
                      setFillFactor('');
                    }}
                    disabled={validateNumbers(fillFactor)}
                    className={`rounded-full p-4 ${validateNumbers(fillFactor) ? 'bg-gray-400' : 'bg-[#ffde2d]'}`}>
                    <Feather
                      name="check"
                      size={28}
                      color={validateNumbers(fillFactor) ? '#7c7c7c' : '#231f1e'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ----------------------------------------------------- */}
      {/* -------------------- MODAL TIMER -------------------- */}
      {/* ----------------------------------------------------- */}

      <TimerModal
        visible={showTimerModal}
        onClose={() => setShowTimerModal(false)}
        onSave={(time: number) => handleChange('totalTime', time.toString())}>
        {/* bruh */}
      </TimerModal>
    </View>
  );
}
