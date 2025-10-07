import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreditsScreen from '../screens/CreditsScreen';
import MenuScreen from 'screens/MenuScreen';
import { useTranslation } from 'react-i18next';
import '../global.css';
import LDVScreen from 'screens/LDVScreen';
import SalesValueScreen from 'screens/SalesValueScreen';

const Stack = createStackNavigator();

// const CalcBStack = createStackNavigator();

// function CalcBNavigator() {
//   return (
//     <CalcBStack.Navigator screenOptions={{ headerShown: false }}>
//       <CalcBStack.Screen name="CalcBHome" component={HomeCalcB} />
//       <CalcBStack.Screen name="CalcBResult" component={ResultB} />
//     </CalcBStack.Navigator>
//   );
// }

export default function Navigation() {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Menu"
          component={MenuScreen}
          options={{ title: t('menu.screenTitle'), cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
          name="LDV"
          component={LDVScreen}
          options={{ title: t('LDV.screenTitle'), cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
          name="SalesValue"
          component={SalesValueScreen}
          options={{ title: t('salesValue.screenTitle'), cardStyle: { flex: 1 } }}
        />
        <Stack.Screen
          name="Credits"
          component={CreditsScreen}
          options={{ title: t('credits.screenTitle'), cardStyle: { flex: 1 } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
