import { StyleSheet, Text, View } from "react-native";

const defaultError = {
    errorText1: 'Oops something went wrong!',
    errorText2: 'Make you are connect to internet'
}

type Props = { errorText1?: string, errorText2?: string };

export default function Error({errorText1 = defaultError.errorText1, errorText2 = defaultError.errorText2}: Props){
    return (
        <View style={styles.container}>
            <Text style={styles.textError}>{errorText1}</Text>
            <Text style={styles.textError}>{errorText2}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    textError: {
        color:'red',
        fontSize: 22
    }
  });