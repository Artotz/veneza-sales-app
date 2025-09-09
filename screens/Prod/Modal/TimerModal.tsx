import { useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function TimerModal({ visible, onClose, onSave }: any) {
  const { t } = useTranslation();
  const [time, setTime] = useState(0); // em segundos
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };

  const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 items-center justify-center bg-black/60">
          {/* conteúdo ignora o clique no fundo */}
          <TouchableWithoutFeedback>
            <View className="w-11/12 rounded-2xl bg-white p-6">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-[#231f1e]">
                  {t('prodCalc.timeModal.title')}
                </Text>
              </View>

              <View className="rounded-xl border border-gray-300 bg-gray-50 p-3">
                <Text className="mb-6 text-center text-5xl font-bold text-[#231f1e]">
                  {formatTime(time)}
                </Text>

                <View className="flex-row justify-around">
                  <TouchableOpacity
                    onPress={resetTimer}
                    className="mx-1 flex-1 items-center justify-center rounded-2xl border border-[#ffde2d] bg-[#231f1e] px-6 py-3">
                    <Text className="font-bold text-[#ffde2d]">
                      {t('prodCalc.timeModal.reset')}
                    </Text>
                  </TouchableOpacity>

                  {running ? (
                    <TouchableOpacity
                      onPress={pauseTimer}
                      className="mx-1 flex-1 items-center justify-center rounded-2xl bg-[#ffde2d] px-6 py-3">
                      <Text className="font-bold text-[#231f1e]">
                        {t('prodCalc.timeModal.pause')}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={startTimer}
                      className="mx-1 flex-1 items-center justify-center rounded-2xl bg-[#ffde2d] px-6 py-3">
                      <Text className="font-bold text-[#231f1e]">
                        {time > 0 ? t('prodCalc.timeModal.restart') : t('prodCalc.timeModal.start')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="mt-4 flex-row justify-center gap-8">
                <TouchableOpacity
                  onPress={onClose}
                  className="rounded-full border border-[#ffde2d] bg-[#231f1e] p-4">
                  <Feather name="x" size={28} color="#ffde2d" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onSave(time);
                    resetTimer();
                    onClose();
                  }}
                  disabled={time === 0}
                  className={`rounded-full p-4 ${time === 0 ? 'bg-gray-400' : 'bg-[#ffde2d]'}`}>
                  <Feather name="check" size={28} color={time === 0 ? '#7c7c7c' : '#231f1e'} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
