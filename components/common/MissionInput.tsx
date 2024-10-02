import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import { colors } from "@/constants/Colors";

export default function MissionInput({
  text,
  setText,
}: {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="미션을 등록해주세요!"
        onChangeText={setText}
        value={text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderColor: colors.accent,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: "#333",
  },
});
