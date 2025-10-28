import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import * as Yup from 'yup'
import React, { useState } from 'react'
import { Formik } from 'formik';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import Clipboard from '@react-native-clipboard/clipboard';

// Yup for validation
const PasswordSchema = Yup.object().shape({
  passwordLength: Yup.number()
    .min(3, 'Should be atleast 3')
    .max(10, 'Should be at max 10')
    .required('Required!')
})

export default function App() {

  // UseState for state management
  const [password, setPassword] = useState('')
  const [isPasswordGenerated, setIsPasswordGenerated] = useState(false)
  const [lowerCase, setLowerCase] = useState(true)
  const [upperCase, setUpperCase] = useState(false)
  const [numbers, setNumbers] = useState(false)
  const [symbols, setSymbols] = useState(false)

  // Methods for application

  // To generate password
  const generatePasswordString = (passwordLength: number) => {
    let characterSet = '';
    const upperCaseSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowerCaseSet = 'abcdefghijklmnopqrstuvwxyz'
    const numberSet = '0123456789'
    const symbolSet = '!@#$%^&*()'

    if (upperCase) characterSet += upperCaseSet;
    if (lowerCase) characterSet += lowerCaseSet;
    if (numbers) characterSet += numberSet;
    if (symbols) characterSet += symbolSet;

    const passwordResult = createPassword(passwordLength, characterSet);
    setPassword(passwordResult)
    setIsPasswordGenerated(true)

  }

  //To create password
  const createPassword = (passwordLength: number, characters: string) => {
    let result = ''
    for (let i = 0; i < passwordLength; i++) {
      const characterIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(characterIndex)
    }
    return result;
  }

  //
  const resetPassword = () => {
    setPassword('')
    setIsPasswordGenerated(false)
    setNumbers(false)
    setUpperCase(false)
    setSymbols(false)
    setLowerCase(true)
  }



  return (
    <ScrollView keyboardShouldPersistTaps='handled' style={{ backgroundColor: '#2b2b2bff' }}>
      <SafeAreaView style={styles.appContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Password Generator</Text>
          <Formik
            //Input field is passwordLength
            initialValues={{ passwordLength: '' }}
            //Since we have defined the validation above
            validationSchema={PasswordSchema}
            //Onsubmit function
            onSubmit={values => {
              generatePasswordString(Number(values.passwordLength))
            }}
          >
            {({
              values,
              errors,
              touched,
              isValid,
              handleChange,
              handleSubmit,
              handleReset
            }) => (
              <>
                {/* For Input + Options */}
                <View style={styles.inputWrapper}>
                  {/* Input Box */}
                  <View style={styles.inputColumn}>
                    <Text style={styles.heading}>Password Length</Text>

                    {/* Conditional Rendering */}
                    {touched.passwordLength && errors.passwordLength && (
                      <Text style={styles.errorText}>{errors.passwordLength}</Text>
                    )}

                  </View>
                  <TextInput
                    style={styles.inputStyle}
                    // We want the value entered to be passed to passwordLength
                    value={values.passwordLength}
                    onChangeText={handleChange('passwordLength')}
                    keyboardType='numeric'
                    placeholder='Length'
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Lower Case</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={lowerCase}
                    onPress={() => setLowerCase(!lowerCase)}
                    iconStyle={{ borderColor: '#E1D0B3' }}
                    fillColor='#E1D0B3' />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Upper Case</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={upperCase}
                    onPress={() => setUpperCase(!upperCase)}
                    iconStyle={{ borderColor: '#427A76' }}
                    fillColor='#427A76' />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Numbers</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={numbers}
                    onPress={() => setNumbers(!numbers)}
                    iconStyle={{ borderColor: '#5B532C' }}
                    fillColor='#5B532C' />
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.heading}>Include Symbols</Text>
                  <BouncyCheckbox
                    disableBuiltInState
                    isChecked={symbols}
                    onPress={() => setSymbols(!symbols)}
                  />
                </View>

                {/* For Buttons */}
                <View style={styles.formActions}>
                  <TouchableOpacity style={styles.primaryBtn} disabled={!isValid} onPress={handleSubmit}>
                    <Text style={styles.primaryBtnTxt}>Generate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={() => { handleReset(); resetPassword() }}>
                    <Text style={styles.secondaryBtnTxt}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
        {isPasswordGenerated ? (
          <View style={[styles.card, styles.cardElevated]}>
            <Text style={styles.subTitle}>Password:</Text>
            <Text selectable={true} style={styles.generatedPassword}>{password}</Text>
            {password !== '' ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={() => {
                  setPassword(''); resetPassword(); setIsPasswordGenerated(false)
                }}>
                  <Text style={styles.secondaryBtnTxt}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => {
                  Clipboard.setString(password)
                }}>
                  <Text style={styles.primaryBtnTxt}>Copy</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : null}
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  formContainer: {
    margin: 8,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    color: '#758283',
    marginBottom: 8,
  },
  heading: {
    fontSize: 15,
    color: 'white'
  },
  inputWrapper: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  inputColumn: {
    flexDirection: 'column',
  },
  inputStyle: {
    padding: 8,
    width: '50%',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#636363',
  },
  errorText: {
    fontSize: 12,
    color: '#ff0d10',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#000',
  },
  primaryBtnTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  secondaryBtn: {
    width: 120,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#4f4e4eff',
  },
  secondaryBtnTxt: {
    textAlign: 'center',
    color: '#bebcbcff'
  },
  card: {
    padding: 12,
    borderRadius: 6,
    marginHorizontal: 12,
  },
  cardElevated: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: '#333',
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  generatedPassword: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000'
  },
});