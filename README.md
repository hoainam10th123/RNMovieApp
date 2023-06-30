# React Native Movie app - Net core 6
Demo: https://youtu.be/D3lNCYLTuhE
## 1 Backend: .Net Core 6
<ol>
  <li>EFCore.BulkExtensions (Data movie: 6000 record, Dữ liệu training 18000 record)</li>
  <li>EntityFrameworkCore</li>
  <li>Quartz.Net</li>
  <li>ML.Net (Scalable Model, DatabaseLoader, Movie Recommender- Matrix Factorization)</li>
  <li>SignalR</li>
  <li>TMDB movie Api</li>
</ol>

## 2 React Native 0.71.11
<ol>
  <li>Redux toolkit</li>
  <li>React navigation v6</li>
  <li>SignalR</li>
  <li>Validation form yup</li>
  <li>SignalR</li>
  <li>TypeScript</li>
</ol>



## Cấu hình ban đầu
### 1 React Native
**Sau khi npm i xong. Truy cập đường dẫn MovieAI\node_modules\react-native\index.js**
**Tìm *ColorPropType* sẽ ra các kết quả như thế này:**
```javascript
// Deprecated Prop Types
  get ColorPropType(): $FlowFixMe {
    console.error(
      'ColorPropType will be removed from React Native, along with all ' +
        'other PropTypes. We recommend that you migrate away from PropTypes ' +
        'and switch to a type system like TypeScript. If you need to ' +
        'continue using ColorPropType, migrate to the ' +
        "'deprecated-react-native-prop-types' package.",
    );
    return require('deprecated-react-native-prop-types').ColorPropType;
  },
  get EdgeInsetsPropType(): $FlowFixMe {
    console.error(
      'EdgeInsetsPropType will be removed from React Native, along with all ' +
        'other PropTypes. We recommend that you migrate away from PropTypes ' +
        'and switch to a type system like TypeScript. If you need to ' +
        'continue using EdgeInsetsPropType, migrate to the ' +
        "'deprecated-react-native-prop-types' package.",
    );
    return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
  },
  get PointPropType(): $FlowFixMe {
    console.error(
      'PointPropType will be removed from React Native, along with all ' +
        'other PropTypes. We recommend that you migrate away from PropTypes ' +
        'and switch to a type system like TypeScript. If you need to ' +
        'continue using PointPropType, migrate to the ' +
        "'deprecated-react-native-prop-types' package.",
    );
    return require('deprecated-react-native-prop-types').PointPropType;
  },
  get ViewPropTypes(): $FlowFixMe {
    console.error(
      'ViewPropTypes will be removed from React Native, along with all ' +
        'other PropTypes. We recommend that you migrate away from PropTypes ' +
        'and switch to a type system like TypeScript. If you need to ' +
        'continue using ViewPropTypes, migrate to the ' +
        "'deprecated-react-native-prop-types' package.",
    );
    return require('deprecated-react-native-prop-types').ViewPropTypes;
  },
```
**Sau đó chỉ cần xóa console.error hết thành như này**
```javascript
get ColorPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').ColorPropType;
  },
  get EdgeInsetsPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
  },
  get PointPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').PointPropType;
  },
  get ViewPropTypes(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').ViewPropTypes;
  },
```
# Xong React native

### 2 Phần .Net core
**chỉ cần tạo db với tên là MovieAiDb. sau đó chạy sql đính kèm để tạo bảng và data kèm theo. nhớ sửa chuổi kết nối để chạy**
