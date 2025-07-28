# SafeAreaView - 태그

- 기기의 영역을 보장한다. ios는 노치와 하단바 / and는 상태바와 하단 네비게이션
- 따라 화면의 최상단에서는 SafeAreaView를 사용하는게 권장되는 패턴
- 그러나 안드로이드에서 적용 문제 사례가 있기 때문에 두 플랫폼을 완벽 지원하기 위한 라이브러리 사용 권장

```js
$ npm install react-native-safe-area-context
```

```js
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
```

안전하게 사용하기위해선 provider를 가장 바깥쪽에 감싼다.

# KeyboardAvoidingView

키보드가 올라올 때 화면이 가려지지 않도록 자동으로 조정해주는 컴포넌트

```js
import { KeyboardAvoidingView, Platform } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <TextInput placeholder="입력하세요" />
</KeyboardAvoidingView>;
```

**주요 props:**

- `behavior`: 'height' | 'position' | 'padding'
- `keyboardVerticalOffset`: 키보드와의 거리 조정

# ScrollView

스크롤 가능한 뷰 컴포넌트

```js
import { ScrollView } from 'react-native';

<ScrollView
  showsVerticalScrollIndicator={false}
  bounces={false}
  onScroll={(e) => console.log(e.nativeEvent.contentOffset.y)}
>
  <View style={{ height: 2000 }}>{/* 긴 컨텐츠 */}</View>
</ScrollView>;
```

**주요 props:**

- `horizontal`: 가로 스크롤
- `showsVerticalScrollIndicator`: 스크롤바 표시
- `bounces`: 바운스 효과 (iOS)
- `pagingEnabled`: 페이지 단위 스크롤

# FlatList

성능 최적화된 리스트 컴포넌트 (가상화 지원)

```js
import { FlatList } from 'react-native';

<FlatList
  data={[
    { id: 1, title: 'Item 1' },
    { id: 2, title: 'Item 2' },
  ]}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Text>{item.title}</Text>}
  onEndReached={() => console.log('더 불러오기')}
  onEndReachedThreshold={0.1}
/>;
```

**주요 props:**

- `data`: 배열 데이터
- `renderItem`: 아이템 렌더링 함수
- `keyExtractor`: 고유 키 추출
- `onEndReached`: 끝에 도달했을 때
- `refreshing`: 새로고침 상태

# SectionList

섹션별로 그룹화된 리스트

```js
import { SectionList } from 'react-native';

<SectionList
  sections={[
    { title: '과일', data: ['사과', '바나나'] },
    { title: '야채', data: ['당근', '양파'] },
  ]}
  keyExtractor={(item, index) => item + index}
  renderItem={({ item }) => <Text>{item}</Text>}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold' }}>{title}</Text>
  )}
/>;
```

# TextInput

텍스트 입력 컴포넌트

```js
import { TextInput } from 'react-native';

<TextInput
  value={text}
  onChangeText={setText}
  placeholder="입력하세요"
  secureTextEntry={true} // 비밀번호
  multiline={true} // 여러 줄
  numberOfLines={4}
  keyboardType="email-address"
  autoCapitalize="none"
  returnKeyType="done"
  onSubmitEditing={() => console.log('완료')}
/>;
```

**주요 props:**

- `keyboardType`: 'default' | 'numeric' | 'email-address' | 'phone-pad'
- `returnKeyType`: 'done' | 'go' | 'next' | 'search' | 'send'
- `autoFocus`: 자동 포커스
- `maxLength`: 최대 글자수

(returnKeyTpye은 키보드의 리턴 키(엔터 키) 모양과 텍스트를 바꾸는 속성)

- done : 키보드 닫기
- next : 다음 입력필드로 이동
- go : 폼제출 or 페이지 이동
- search : 검색실행
- send : 메시지 전송 or 댓글 작성

# TouchableOpacity

터치 가능한 컴포넌트 (투명도 변화)

```js
import { TouchableOpacity } from 'react-native';

<TouchableOpacity
  activeOpacity={0.7}
  onPress={() => console.log('눌림')}
  onLongPress={() => console.log('길게 눌림')}
  disabled={false}
>
  <Text>버튼</Text>
</TouchableOpacity>;
```

# TouchableHighlight

터치 시 하이라이트 효과

```js
import { TouchableHighlight } from 'react-native';

<TouchableHighlight underlayColor="#DDDDDD" onPress={() => console.log('눌림')}>
  <Text>버튼</Text>
</TouchableHighlight>;
```

# Pressable (추천)

더 유연한 터치 컴포넌트

```js
import { Pressable } from 'react-native';

<Pressable
  onPress={() => console.log('눌림')}
  style={({ pressed }) => [{ backgroundColor: pressed ? '#ddd' : '#fff' }]}
>
  {({ pressed }) => (
    <Text style={{ color: pressed ? 'blue' : 'black' }}>버튼</Text>
  )}
</Pressable>;
```

# Switch

토글 스위치

```js
import { Switch } from 'react-native';

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: '#767577', true: '#81b0ff' }}
  thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
/>;
```

# ActivityIndicator

로딩 스피너

```js
import { ActivityIndicator } from 'react-native';

<ActivityIndicator size="large" color="#0000ff" animating={true} />;
```

# Modal

모달 창

```js
import { Modal } from 'react-native';

<Modal
  visible={modalVisible}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setModalVisible(false)}
>
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <View style={{ backgroundColor: 'white', margin: 20 }}>
      <Text>모달 내용</Text>
    </View>
  </View>
</Modal>;
```

**animationType:**

- 'slide': 아래에서 위로
- 'fade': 페이드 인/아웃
- 'none': 애니메이션 없음

# Alert

네이티브 알림창

```js
import { Alert } from 'react-native';

// 간단한 알림
Alert.alert('제목', '메시지');

// 버튼이 있는 알림
Alert.alert('확인', '정말로 삭제하시겠습니까?', [
  { text: '취소', style: 'cancel' },
  { text: '삭제', style: 'destructive', onPress: () => console.log('삭제') },
]);
```

# StatusBar

상태바 제어

```js
import { StatusBar } from 'react-native';

<StatusBar
  barStyle="dark-content" // 'light-content' | 'dark-content'
  backgroundColor="#ffffff" // Android only
  hidden={false}
  translucent={true} // Android only
/>;
```

# RefreshControl

새로고침 컨트롤 (ScrollView, FlatList와 함께 사용)

```js
import { RefreshControl } from 'react-native';

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={['#ff0000']} // Android
      tintColor="#ff0000" // iOS
    />
  }
>
  {/* 내용 */}
</ScrollView>;
```

# 안드 스튜디오를 실행하면 파일들이 추가된다.

```js
.idea/
*.iml
*.iws
*.ipr
```

파일이 생기는데 gitignore 에 추가해주기.

# 스플래시 화면

앱이 시작될 때 가장먼저 보여지는 화면

- 앱 전체 사이클에서만 딱 한번 사용
- 앱을 실행하자마자 나타나는 첫 화면
- 앱이 로딩되는 동안 사용자에게 보여줌
- 보통 앱 로고, 이름, 브랜딩 요소가 포함됨
- 몇 초간 표시된 후 메인 화면으로 전환

# AsyncStorage

```js
// 웹 localStorage (동기)
localStorage.setItem('key', 'value'); // 즉시 완료
const value = localStorage.getItem('key'); // 즉시 반환

// React Native AsyncStorage (비동기)
await AsyncStorage.setItem('key', 'value'); // Promise 반환
const value = await AsyncStorage.getItem('key'); // Promise 반환
```

string 타입만 저장 / 조회 가능

- 저장 시: 무조건 JSON.stringify()
- 조회 시: 무조건 JSON.parse()
  ![AsyncStorage 리턴 값](assets/studyImg/storage.png)

# 스타일 시트

## flatten()

```js
const styles = StyleSheet.create({
  base: { padding: 10, margin: 5 },
  text: { fontSize: 16, color: 'black' },
  bold: { fontWeight: 'bold' },
});

// 여러 스타일을 조합할 때
const combinedStyle = StyleSheet.flatten([
  styles.base,
  styles.text,
  isImportant && styles.bold, // 조건부 스타일
]);

// 결과: { padding: 10, margin: 5, fontSize: 16, color: 'black', fontWeight: 'bold' }
```

사용 예시

```js
// 조건부 스타일 혼합
const buttonStyle = StyleSheet.flatten([
  styles.baseButton,
  disabled && styles.disabledButton,
  primary && styles.primaryButton,
]);

// prop으로 받은 스타일과 기본 스타일 합치기

const CustomComponent = ({ style }) => {
  const finalStyle = StyleSheet.flatten([styles.default, style]);
  return <View style={finalStyle} />;
};
```

주의점!

- 나중 스타일이 앞 스타일을 덮어씀
- null, undefined, false 값들은 자동으로 필터링됨

## hairlineWidth

- hairlineWidth는 React Native에서 가장 얇은 선을 그리기 위한 플랫폼별 최소 너비값
- borderWidth: 1는 너무 두꺼울 수 있기 때문

```js
import { StyleSheet } from 'react-native';

// 플랫폼별 최소 픽셀 너비
console.log(StyleSheet.hairlineWidth);
// iOS: 0.5 또는 1/3 (기기에 따라)
// Android: 1
```
