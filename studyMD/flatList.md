# React Native FlatList 완전 가이드

## FlatList란?

ScrollView와 달리 **가상화(Virtualization)**를 지원하는 고성능 리스트 컴포넌트입니다.

### ScrollView vs FlatList 차이점

```js
// ScrollView - 모든 항목을 한번에 렌더링 (성능 이슈)
<ScrollView>
  {data.map(item => <ItemComponent key={item.id} item={item} />)}
</ScrollView>

// FlatList - 화면에 보이는 항목만 렌더링 (고성능)
<FlatList
  data={data}
  renderItem={({ item }) => <ItemComponent item={item} />}
  keyExtractor={item => item.id.toString()}
/>
```

## 기본 사용법

```js
import { FlatList } from 'react-native';

const BasicFlatList = () => {
  const data = [
    { id: 1, name: '아이템 1' },
    { id: 2, name: '아이템 2' },
    { id: 3, name: '아이템 3' },
  ];

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View style={{ padding: 20, borderBottomWidth: 1 }}>
          <Text>
            {index}: {item.name}
          </Text>
        </View>
      )}
    />
  );
};
```

## 필수 Props

### data

렌더링할 배열 데이터

```js
const data = [
  { id: 1, title: 'First Item' },
  { id: 2, title: 'Second Item' },
];
```

### renderItem

각 아이템을 렌더링하는 함수

```js
renderItem={({ item, index, separators }) => (
  <TouchableOpacity onPress={() => console.log(item)}>
    <Text>{item.title}</Text>
  </TouchableOpacity>
)}
```

### keyExtractor

각 아이템의 고유 키를 추출하는 함수

```js
keyExtractor={(item, index) => item.id.toString()}
// 또는
keyExtractor={(item, index) => index.toString()}
```

## 성능 최적화 Props

### getItemLayout

아이템 크기를 미리 계산해서 성능 향상

```js
// 모든 아이템이 같은 높이일 때만 사용
getItemLayout={(data, index) => (
  { length: 80, offset: 80 * index, index }
)}
```

### initialNumToRender

초기에 렌더링할 아이템 개수 (기본값: 10)

```js
initialNumToRender={20}
```

### maxToRenderPerBatch

한 번에 렌더링할 최대 아이템 개수

```js
maxToRenderPerBatch={10}
```

### windowSize

메모리에 유지할 화면 수 (기본값: 21)

```js
windowSize={10}
```

### removeClippedSubviews

화면 밖 뷰를 제거해서 메모리 절약

```js
removeClippedSubviews={true}
```

## 새로고침 기능

```js
import { RefreshControl } from 'react-native';

const [refreshing, setRefreshing] = useState(false);

const onRefresh = useCallback(() => {
  setRefreshing(true);
  // 데이터 새로고침 로직
  fetchData().then(() => setRefreshing(false));
}, []);

<FlatList
  data={data}
  renderItem={renderItem}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#ff0000']} // Android
      tintColor="#ff0000" // iOS
    />
  }
/>;
```

## 무한 스크롤 (Pagination)

```js
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [page, setPage] = useState(1);

const loadMoreData = () => {
  if (loading) return;

  setLoading(true);
  fetchMoreData(page).then((newData) => {
    setData((prev) => [...prev, ...newData]);
    setPage((prev) => prev + 1);
    setLoading(false);
  });
};

<FlatList
  data={data}
  renderItem={renderItem}
  onEndReached={loadMoreData}
  onEndReachedThreshold={0.1} // 90% 스크롤시 호출
  ListFooterComponent={() => (loading ? <ActivityIndicator /> : null)}
/>;
```

## 헤더와 푸터

```js
<FlatList
  data={data}
  renderItem={renderItem}
  ListHeaderComponent={() => (
    <View style={{ padding: 20, backgroundColor: '#f0f0f0' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>헤더</Text>
    </View>
  )}
  ListFooterComponent={() => (
    <View style={{ padding: 20, alignItems: 'center' }}>
      <Text>더 이상 항목이 없습니다</Text>
    </View>
  )}
  ListEmptyComponent={() => (
    <View style={{ padding: 50, alignItems: 'center' }}>
      <Text>데이터가 없습니다</Text>
    </View>
  )}
/>
```

## 구분선 (Separator)

```js
<FlatList
  data={data}
  renderItem={renderItem}
  ItemSeparatorComponent={() => (
    <View
      style={{
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#ccc',
      }}
    />
  )}
/>
```

## 가로 스크롤

```js
<FlatList
  data={data}
  renderItem={({ item }) => (
    <View style={{ width: 150, marginRight: 10 }}>
      <Text>{item.title}</Text>
    </View>
  )}
  horizontal={true}
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ paddingHorizontal: 20 }}
/>
```

## 그리드 레이아웃

```js
<FlatList
  data={data}
  renderItem={({ item }) => (
    <View
      style={{
        flex: 1,
        margin: 5,
        height: 100,
        backgroundColor: '#f0f0f0',
      }}
    >
      <Text>{item.title}</Text>
    </View>
  )}
  numColumns={2} // 2열 그리드
  key={2} // numColumns 변경시 key도 변경 필요
/>
```

## 고급 예제: 완전한 리스트

```js
import React, { useState, useCallback, useEffect } from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';

const AdvancedFlatList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async (pageNum = 1, isRefresh = false) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/items?page=${pageNum}`);
      const newItems = await response.json();

      if (isRefresh) {
        setData(newItems);
        setPage(2);
      } else {
        setData((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1, true);
  }, []);

  const onEndReached = useCallback(() => {
    if (!loading) {
      fetchData(page);
    }
  }, [loading, page]);

  const renderItem = useCallback(
    ({ item, index }) => (
      <TouchableOpacity style={styles.item}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
    ),
    []
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
        <Text>로딩 중...</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListFooterComponent={renderFooter}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text>데이터가 없습니다</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      getItemLayout={(data, index) => ({
        length: 80,
        offset: 80 * index,
        index,
      })}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  empty: {
    padding: 50,
    alignItems: 'center',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ccc',
  },
});
```

## 주의사항

### 1. 아이템 높이가 다를 때

`getItemLayout`을 사용하면 안 됨. 동적 높이일 때는 생략.

### 2. 메모리 관리

```js
// 큰 이미지나 복잡한 컴포넌트일 때
removeClippedSubviews={true}
windowSize={5} // 작게 설정
```

### 3. 성능 최적화

```js
// renderItem을 useCallback으로 감싸기
const renderItem = useCallback(({ item }) => <ItemComponent item={item} />, []);
```

### 4. 데이터 업데이트

```js
// 잘못된 방법 - 직접 수정
data[0].title = 'Updated';

// 올바른 방법 - 새 배열 생성
setData((prev) =>
  prev.map((item) =>
    item.id === targetId ? { ...item, title: 'Updated' } : item
  )
);
```

## 언제 사용할까?

- **FlatList 사용**: 100개 이상의 많은 데이터
- **ScrollView 사용**: 적은 데이터 (50개 미만)
- **SectionList 사용**: 섹션별로 그룹화된 데이터
