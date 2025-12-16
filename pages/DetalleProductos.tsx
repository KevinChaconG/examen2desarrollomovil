import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, TouchableOpacity, Image } from "react-native";
import { API_URL } from "../config";

type Producto = {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  estado: string;
  categoria: string;
  url_fotografia: string;
};

export default function DetalleProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  async function cargarProductos() {
    try {
      setCargando(true);
      const resp = await fetch(`${API_URL}/productos`);
      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert("Error", data?.mensaje || "No se pudieron cargar los productos");
        return;
      }

      setProductos(data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor (revisa IP y puerto).");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Detalle Productos
      </Text>

      <TouchableOpacity
        onPress={cargarProductos}
        style={{ marginBottom: 12 }}
      >
        <Text style={{ fontWeight: "bold" }}>🔄 Recargar</Text>
      </TouchableOpacity>

      <FlatList
        data={productos}
        keyExtractor={(item) => String(item.id_producto)}
        ListEmptyComponent={<Text>No hay productos aún.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{item.nombre}</Text>
            <Text>{item.descripcion}</Text>
            <Text style={{ marginTop: 6 }}>Precio: L. {item.precio}</Text>
            <Text>Estado: {item.estado}</Text>
            <Text>Categoría: {item.categoria}</Text>

            {!!item.url_fotografia && (
              <Image
                source={{ uri: item.url_fotografia }}
                style={{ width: "100%", height: 180, marginTop: 10, borderRadius: 10 }}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      />
    </View>
  );
}
