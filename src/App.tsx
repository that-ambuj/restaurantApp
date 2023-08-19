import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  useColorScheme,
  StatusBar,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { systemWeights } from "react-native-typography";

import { type FoodItem, FoodItemComponent } from "./components/Food";

const queryClient = new QueryClient();

type FoodItems = {
  data: FoodItem[];
  current_page: number;
  total_pages: 2;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeComponent />
    </QueryClientProvider>
  );
}

function HomeComponent() {
  const fetchFoodItems = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `https://restaurant-api.shuttleapp.rs/menu?page=${pageParam}`,
    );
    return res.json();
  };

  const { data, isLoading, refetch } = useQuery<FoodItems>({
    queryKey: ["foodItems"],
    queryFn: fetchFoodItems,
  });

  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaView className="bg-neutral-100 h-full dark:bg-neutral-950">
      <StatusBar
        backgroundColor={isDarkMode ? "#18181b" : "white"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <View className="flex flex-row items-center w-full justify-center shadow-2xl shadow-neutral-700 bg-white dark:bg-neutral-900">
        <SvgUri uri="https://img.logoipsum.com/298.svg" height="45%" />
        <Text
          style={systemWeights.bold}
          className="text-3xl py-4 text-neutral-800 dark:text-neutral-300">
          Food Menu
        </Text>
      </View>
      <FlatList
        data={data?.data}
        renderItem={({ item }) => <FoodItemComponent foodInfo={item} />}
        keyExtractor={item => item.id.toString()}
        refreshing={isLoading}
        onRefresh={refetch}
        className="py-4"
      />
    </SafeAreaView>
  );
}

export default App;
