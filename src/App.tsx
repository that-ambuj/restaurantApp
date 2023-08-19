import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  Querycache,
  QueryCache,
} from "@tanstack/react-query";
import React from "react";
import {
  Text,
  View,
  SafeAreaView,
  FlatList,
  useColorScheme,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SvgUri } from "react-native-svg";
import { systemWeights } from "react-native-typography";

import { type TFoodItem, FoodItem } from "./components/Food";

type FoodItems = {
  data: TFoodItem[];
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

const queryCache = new QueryCache();
const queryClient = new QueryClient({ queryCache });

function HomeComponent() {
  const fetchFoodItems = async ({ pageParam = 1 }) => {
    const res = await fetch(
      `https://restaurant-api.shuttleapp.rs/menu?limit=5&page=${pageParam}`,
    );
    return res.json();
  };

  const {
    data,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<FoodItems>({
    queryKey: ["foodItems"],
    queryFn: fetchFoodItems,
    getNextPageParam: lastPage => {
      if (lastPage.current_page < lastPage.total_pages) {
        return lastPage.current_page + 1;
      }

      return null;
    },
    cacheTime: 1,
  });

  const loadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

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
      {data && (
        <FlatList
          data={data.pages.map(d => d.data).flat()}
          renderItem={({ item }) => <FoodItem foodInfo={item} />}
          keyExtractor={item => item.id.toString()}
          refreshing={isLoading}
          onRefresh={refetch}
          onEndReached={loadMore}
          onEndReachedThreshold={0.7}
          ItemSeparatorComponent={FoodItem.Seperator}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                size="large"
                color={isDarkMode ? "#dddddd" : "#333333"}
              />
            ) : (
              <View className="h-12" />
            )
          }
          className="py-6"
        />
      )}
    </SafeAreaView>
  );
}

export default App;
