import { Feather } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Header({ navigation, title, hasBackArrow = true }: any) {
  return (
    <View className="mb-8 flex-row items-center justify-between">
      <TouchableOpacity
        className={`${hasBackArrow ? '' : 'invisible'}`}
        onPress={() => {
          navigation.goBack();
        }}>
        <Feather name="arrow-left" size={22} color="#ffde2d" />
      </TouchableOpacity>

      <Text className="text-center align-middle text-3xl font-extrabold text-[#ffde2d]">
        {title}
      </Text>

      <TouchableOpacity
        className={`${false ? '' : 'invisible'}`}
        onPress={() => {
          navigation.navigate('Credits');
        }}>
        <Feather name="info" size={22} color="#ffde2d" />
      </TouchableOpacity>
    </View>
  );
}
