import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import Productos from '../pages/Productos'
import DetalleProductos from '../pages/DetalleProductos'

export default function Navegacion() {

    const tab = createBottomTabNavigator()
    return (
        <NavigationContainer>
            <tab.Navigator>
                <tab.Screen name='Productos' component={Productos} ></tab.Screen>
                <tab.Screen name='Detalle Productos' component={DetalleProductos} ></tab.Screen>
            </tab.Navigator>
        </NavigationContainer>
    )
}