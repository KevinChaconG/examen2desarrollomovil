import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, Image } from "react-native";
import { API_URL } from "../config";
import * as ImagePicker from "expo-image-picker";

export default function Productos() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("Disponible");
  const [categoria, setCategoria] = useState("");
  const [url_fotografia, setUrlFotografia] = useState("");
  const [cargando, setCargando] = useState(false);
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  function normalizarEstado(valor: string): string {
    const v = (valor || "").trim().toLowerCase();

    if (v === "disponible") return "Disponible";
    if (v === "no disponible" || v === "nodisponible" || v === "no-disponible") return "No disponible";

    return valor;
  }

  async function guardarProducto() {
    const estadoNormalizado = normalizarEstado(estado);

    if (!nombre || !descripcion || !precio || !estadoNormalizado || !categoria || !url_fotografia) {
      Alert.alert("Aviso", "Completa todos los campos (incluye tomar foto).");
      return;
    }

    const precioLimpio = precio.replace(",", ".").trim();
    const precioNumero = Number(precioLimpio);

    if (Number.isNaN(precioNumero)) {
      Alert.alert("Aviso", "El precio debe ser un número válido");
      return;
    }

    if (estadoNormalizado !== "Disponible" && estadoNormalizado !== "No disponible") {
      Alert.alert("Aviso", "Estado debe ser: Disponible o No disponible");
      return;
    }

    try {
      setCargando(true);

      const resp = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          precio: precioNumero,
          estado: estadoNormalizado,
          categoria,
          url_fotografia,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        Alert.alert("Error", data?.mensaje || "No se pudo guardar");
        return;
      }

      Alert.alert("Éxito", "Producto agregado");

      setNombre("");
      setDescripcion("");
      setPrecio("");
      setEstado("Disponible");
      setCategoria("");
      setUrlFotografia("");
      setFotoUri(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "No se pudo conectar al servidor (revisa IP y puerto).");
    } finally {
      setCargando(false);
    }
  }

  async function tomarFoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos permiso para usar la cámara");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFotoUri(uri);
      setUrlFotografia(uri);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Agregar Producto
      </Text>

      <Text>Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Descripción</Text>
      <TextInput
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8, minHeight: 80 }}
      />

      <Text>Estado (Disponible / No disponible)</Text>
      <TextInput
        value={estado}
        onChangeText={setEstado}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Categoría</Text>
      <TextInput
        value={categoria}
        onChangeText={setCategoria}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Text>Precio</Text>
      <TextInput
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <Button title="Tomar foto" onPress={tomarFoto} />

      {fotoUri && (
        <Image
          source={{ uri: fotoUri }}
          style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 10 }}
          resizeMode="cover"
        />
      )}

      <Text style={{ marginTop: 10 }}>URL Fotografía</Text>
      <TextInput
        value={url_fotografia}
        onChangeText={setUrlFotografia}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 16, borderRadius: 8 }}
      />

      <Button
        title={cargando ? "Guardando..." : "Guardar Producto"}
        onPress={guardarProducto}
        disabled={cargando}
      />
    </ScrollView>
  );
}
