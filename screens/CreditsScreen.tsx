import Header from 'components/Header';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  ScrollView,
  //  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreditsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

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
      <ScrollView className="flex-1 bg-[#231f1e]/70 p-4" scrollEventThrottle={16}>
        <Header navigation={navigation} title={t('credits.title')} />

        <View className="flex-1 gap-y-10 pt-[20vh]">
          <View>
            <Text className="text-center text-lg text-gray-200">{t('credits.developedBy')}</Text>
            <Text className="text-center text-2xl font-bold text-white">Artur Melo Catunda</Text>
            <Text className="text-center text-xl font-bold text-white">{t('credits.team')}</Text>
          </View>

          <View>
            <Text className="text-center text-lg text-gray-200">{t('credits.rights')}</Text>
            <Text className="text-center text-base text-gray-300">{t('credits.allRights')}</Text>
          </View>

          <View>
            <Text className="px-6 text-center text-sm text-gray-400">
              {t('credits.disclaimer')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
