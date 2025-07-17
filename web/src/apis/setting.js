import { apiPath, authPath, fortifyPath, settingConfig } from 'src/config'
import axios from 'src/utils/axios'

export const ChangePassWord = async (data) => {
  return await axios.put(settingConfig.changePasswordPath, data, {
    baseURL: authPath
  })
}

export const ConfirmPassword = async (data) => {
  return await axios.post(settingConfig.confirmPasswordPath, data, {
    baseURL: fortifyPath
  })
}

export const ConfirmedPasswordStatus = async () => {
  return await axios.get(settingConfig.confirmedPasswordStatusPath, {
    baseURL: fortifyPath
  })
}

export const EnableTwoFactor = async (data) => {
  return await axios.post(settingConfig.enableTwoFactorPath, data, {
    baseURL: fortifyPath
  })
}

export const DisableTwoFactor = async () => {
  return await axios.delete(settingConfig.disableTwoFactorPath, {
    baseURL: fortifyPath
  })
}

export const GetQrCode = async () => {
  return await axios.get(settingConfig.getQrCodePath, {
    baseURL: fortifyPath
  })
}

export const GetRecovoryCodes = async () => {
  return await axios.get(settingConfig.getRecoveryCodesPath, {
    baseURL: fortifyPath
  })
}

export const RegenerateRecoveryCodes = async (data) => {
  return await axios.post(settingConfig.regenerateRecoveryCodesPath, data, {
    baseURL: fortifyPath
  })
}
