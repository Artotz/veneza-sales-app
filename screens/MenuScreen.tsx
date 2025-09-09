import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from 'components/Header';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import CountryFlag from 'react-native-country-flag';

export default function MenuScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const menuItems = [
    {
      key: 'prod',
      title: t('menu.optionProd'),
      icon: 'activity',
      onPress: () => navigation.navigate('ProdStack'),
      disabled: false,
    },
    {
      key: 'future1',
      title: t('menu.optionToCome'),
      icon: 'clock',
      onPress: () => {},
      disabled: true,
    },
    {
      key: 'future2',
      title: t('menu.optionToCome'),
      icon: 'clock',
      onPress: () => {},
      disabled: true,
    },
    {
      key: 'future3',
      title: t('menu.optionToCome'),
      icon: 'clock',
      onPress: () => {},
      disabled: true,
    },
    {
      key: 'credits',
      title: t('menu.optionCredits'),
      icon: 'info',
      onPress: () => navigation.navigate('Credits'),
      disabled: false,
    },
  ];

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
      <View className="flex-1 bg-[#231f1e]/70 pt-4">
        <Header title={'OperaX'} hasBackArrow={false} />

        <ScrollView className="flex-1 p-4">
          {/* <Header title={t('menu.title')} hasBackArrow={false} /> */}

          {/* ---- Opções do Menu ---- */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.key}
              onPress={item.onPress}
              disabled={item.disabled}
              className={`mb-4 flex-row items-center rounded-2xl border p-4 shadow-lg ${
                item.disabled ? 'border-gray-400 bg-gray-200' : 'border-[#ffde2d] bg-white'
              }`}>
              <Feather
                name={item.icon as any}
                size={24}
                color={item.disabled ? '#7c7c7c' : '#231f1e'}
              />
              <Text
                className={`ml-3 text-lg font-semibold ${
                  item.disabled ? 'text-gray-500' : 'text-[#231f1e]'
                }`}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ---- Seletor de Idioma ---- */}
        <View className="flex-row justify-center gap-6 border-t border-[#ffde2d]/50 p-4">
          <TouchableOpacity onPress={() => changeLanguage('pt')}>
            <CountryFlag isoCode="br" size={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('en')}>
            <CountryFlag isoCode="us" size={28} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => changeLanguage('es')}>
            <CountryFlag isoCode="es" size={28} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
