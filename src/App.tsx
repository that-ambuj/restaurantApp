import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import React, { useContext } from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Pressable,
  useColorScheme,
  Image,
  StatusBar,
} from "react-native";

import { SvgUri } from "react-native-svg";

import { systemWeights } from "react-native-typography";

const queryClient = new QueryClient();

type FoodItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price_rupees: number;
  is_vegetarian: boolean;
};

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

function FoodItemComponent({ foodInfo }: { foodInfo: FoodItem }) {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <Pressable
      android_ripple={{ color: isDarkMode ? "#555555" : "#bbbbbb" }}
      className="my-4 flex flex-row justify-between items-center px-3 py-3 rounded-2xl bg-white dark:bg-neutral-900">
      <View>
        <Image
          source={{ uri: foodInfo.image }}
          style={{ height: 100, width: 100 }}
          className="rounded-lg"
        />
      </View>
      <View className="flex w-4/6">
        <Text className="text-2xl font-medium text-neutral-900 dark:text-neutral-100">
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
}

export default App;
