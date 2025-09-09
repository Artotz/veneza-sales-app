import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProdCalcScreen from '../screens/Prod/ProdCalcScreen';
import ProdResultScreen from '../screens/Prod/ProdResultScreen';
import CreditsScreen from '../screens/CreditsScreen';
import MenuScreen from 'screens/MenuScreen';
import { useTranslation } from 'react-i18next';
import '../global.css';

const Stack = createStackNavigator();

const ProdStack = createStackNavigator();

// const CalcBStack = createStackNavigator();

function ProdNavigator() {
  const { t } = useTranslation();
  return (
    <ProdStack.Navigator screenOptions={{ headerShown: false }}>
      <ProdStack.Screen
        name="ProdCalc"
        component={ProdCalcScreen}
        options={{ title: t('prodCalc.screenTitle'), cardStyle: { flex: 1 } }}
      />
      <ProdStack.Screen
        name="ProdResult"
        component={ProdResultScreen}
        options={{ title: t('prodResult.screenTitle'), cardStyle: { flex: 1 } }}
      />
    </ProdStack.Navigator>
  );
}

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
          name="ProdStack"
          component={ProdNavigator}
          options={{ title: t('prodStack.screenTitle'), cardStyle: { flex: 1 } }}
        />
        {/* <Stack.Screen
          name="CalcBStack"
          component={CalcBNavigator}
          options={{ title: '', cardStyle: { flex: 1 } }}
        /> */}
        <Stack.Screen
          name="Credits"
          component={CreditsScreen}
          options={{ title: t('credits.screenTitle'), cardStyle: { flex: 1 } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
