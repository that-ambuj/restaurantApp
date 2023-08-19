import { Pressable, View, Image, Text, useColorScheme } from "react-native";
import React from "react";

export type TFoodItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price_rupees: number;
  is_vegetarian: boolean;
};

export const FoodItem = ({ foodInfo }: { foodInfo: TFoodItem }) => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Pressable
      android_ripple={{ color: isDarkMode ? "#555555" : "#cccccc" }}
      className="flex flex-row justify-between items-center px-3 py-3 rounded-2xl bg-white dark:bg-neutral-900">
      <View>
        <Image
          source={{ uri: foodInfo.image }}
          style={{ height: 100, width: 100 }}
          className="rounded-lg"
        />
      </View>
      <View className="flex w-4/6">
        <Text className="text-2xl font-semibold tracking-wide text-neutral-900 dark:text-neutral-100">
          {foodInfo.name}
        </Text>
        <Text className="text-neutral-600 dark:text-neutral-400">
          {foodInfo.description.length > 150
            ? foodInfo.description.substring(0, 150) + "..."
            : foodInfo.description}
        </Text>
      </View>
    </Pressable>
  );
};

FoodItem.Seperator = () => {
  return <View className="h-6" />;
};
