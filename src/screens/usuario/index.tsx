import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Center,  Heading, VStack } from "native-base";
import { Input } from '../../components/input/Input';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from '../../components/button/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-tiny-toast';
import uuid from 'react-native-uuid';

type FormDataProps = {
  id: any
  nome:string;
  email:string;
  senha:string;
  confirmaSenha: string;
}

const schemaRegister = yup.object({
  nome: yup.string().required("Nome é obrigatório").min(3, "Informe no minimo 3 digitos"),
  email: yup.string().required("Email é obrigatório").min(6, "Informe no minimo 6 digitos").email("E-mail informado não é valido"),
  senha: yup.string().required("Senha é obrigatório").min(3, "Informe no minimo 3 digitos"),
  confirmaSenha: yup.string()
    .required("Confirmação de senha é obrigatório")
    .oneOf([yup.ref('senha')], "As senha devem coindir"),
})

export const Usuario = () => {

  const {control, handleSubmit, formState: {errors}}  = useForm<FormDataProps>({
      resolver: yupResolver(schemaRegister) as any
  });

  async function handlerRegister(data:FormDataProps){
    data.id = uuid.v4()
    //console.log(data);
    try{
      const reponseData =  await AsyncStorage.getItem('@crud_form:usuario')
      const dbData = reponseData ? JSON.parse(reponseData!) : [];
      console.log(dbData);
      const previewData = [...dbData, data];

      await AsyncStorage.setItem('@crud_form:usuario', JSON.stringify(previewData))
      Toast.showSuccess("Usuário registrado com sucesso")
    }catch (e){
      Toast.showSuccess("Erro ao registrar usuário "+e)
    }


  }


  return (
    <KeyboardAwareScrollView>
    <VStack bgColor="gray.300" flex={1} px={5} pb={100}>
        <Center>
            <Heading my={5}>
                Cadastro de Usuários
            </Heading>
          <Controller 
            control={control}
            name="nome"
            render={({field: {onChange}})=>(
            <Input
              placeholder='Nome'
              onChangeText={onChange}
              errorMessage={errors.nome?.message}
            />
            )}
          />
          <Controller 
            control={control}
            name="email"
            render={({field: {onChange}})=>(
            <Input
              placeholder='E-mail'
              onChangeText={onChange}
              errorMessage={errors.email?.message}
            />
            )}
          />
          <Controller 
            control={control}
            name="senha"
            render={({field: {onChange}})=>(
            <Input
              placeholder='Senha'
              onChangeText={onChange}
              secureTextEntry
              errorMessage={errors.senha?.message}
            />
            )}
          />
          <Controller 
            control={control}
            name="confirmaSenha"
            render={({field: {onChange}})=>(
            <Input
              placeholder='Confirma Senha'
              onChangeText={onChange}
              secureTextEntry
              errorMessage={errors.confirmaSenha?.message}
            />
            )}
          />
           <Button title="Cadastrar" onPress={handleSubmit(handlerRegister)}></Button>
        </Center>
      </VStack>
    </KeyboardAwareScrollView>
      
  );
}

