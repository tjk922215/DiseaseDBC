<template>
<div id="login">
  <h1 id="login-title">Hello, Again</h1>
  <el-form :model="loginForm" :rules="loginRules" ref="loginForm" label-width="0px">
    <div id="username-input">
      <el-form-item label="" prop="usernameInput">
        <el-input v-model="loginForm.usernameInput" @keyup.enter.native="login('loginForm')" size="large"
                  placeholder="请输入用户名">
        </el-input>
      </el-form-item>
    </div>
    <div id="password-input">
      <el-form-item label="" prop="passwordInput">
        <el-input id="login-password-input" type="password" v-model="loginForm.passwordInput"
                  @keyup.enter.native="login('loginForm')" size="large" placeholder="请输入密码">
        </el-input>
      </el-form-item>
    </div>
    <el-form-item>
      <div id="login-button">
        <el-button id="login-login-btn" type="primary" @click="login('loginForm')">登录</el-button>
        <el-button id="login-register-btn" @click="onRegister">注册</el-button>
      </div>
    </el-form-item>
  </el-form>

  <el-dialog  title="新用户注册" v-model="dialogVisible" size="small">
    <div id="login-dialog">
      <el-form :model="register" :rules="registerRules" ref="register" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input class="register-input" v-model="register.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input type="password" class="register-input" v-model="register.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input type="password" class="register-input" v-model="register.confirm"></el-input>
        </el-form-item>
      </el-form>
      <span class="hint">*注册的用户只具有浏览权限，如需录入请与管理员联系</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="addUser('register')">注 册</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>

  <div id="login-info-container">
    <el-row>
      <span>Asia Disease Database</span>
    </el-row>
    <el-row>
      <span>Version 1.10</span>
    </el-row>
  </div>
</div>
</template>

<script>
import api from '../model/api.js'

export default {
  name: 'login',
  data() {
    var validatePass1 = (rule, value, callback) => {
        if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.register.confirm !== '') {
        this.$refs.register.validateField('confirm')
      }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.register.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      //  login
      loginForm: {
        usernameInput: '',
        passwordInput: '',
      },
      loginRules: {
        usernameInput: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passwordInput: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      //  register
      register: {
        userame: '',
        password: '',
        confirm: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass1, trigger: 'blur' },
          { min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
        ],
        confirm: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.login(this.loginForm.usernameInput, this.loginForm.passwordInput)
            .then((res) => {
              if (res.data.success == true) {
                // console.log(res.data)
                this.$store.commit('updateIslogin', true)
                this.$store.commit('updateUserInfo', {
                  authority: res.data.authority,
                  id: res.data.id,
                  username: res.data.username
                })
                this.$router.push('/home')
              } else {
                this.$notify({
                  title: '登录失败',
                  message: '用户名或密码错误',
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              this.$notify({
                title: '',
                message: '登录失败',
                type: '网络异常'
              })
            })
        } else {
          return false
        }
      })
    },
    onRegister () {
      this.dialogVisible = true
    },
    addUser (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          api.register(this.register.username, this.register.password, 4)
            .then((res) => {
              if (res.data.success) {
                this.$notify({
                  title: '',
                  message: '注册成功',
                  type: 'success'
                })
              } else {
                // console.log(res)
                this.$notify({
                  title: '注册失败',
                  message: '用户名重复',
                  type: 'warning'
                })
              }
            })
            .catch((err) => {
              console.log(err)
              this.$notify({
                title: '',
                message: '注册失败',
                type: 'warning'
              })
            })
        } else {
          // console.log('error submit!!');
          return false;
        }
      })
    }
  }
}
</script>

<style>
body {

}

#login-title {
  font-size: 40px;
  margin-top: 15%;
  color: #FFFFFF;
  font-family:'Raleway9a5510a661882e';
}

#login-login-btn {
  background-color: rgba(255, 255, 255, 0.2);
  border-style: none;
  width: 10%;
}

#login-login-btn:hover {
  background-color: rgba(184, 78, 52, 0.7);
}

#login-register-btn {
  background-color: rgba(255, 255, 255, 0.3);
  border-style: none;
  color: #FFFFFF;
  width: 10%;
}

#login-register-btn:hover {
  background-color: rgba(184, 78, 52, 0.7);
}

#login {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('../assets/background1.jpg');
  background-size: cover;
}

#username-input {
  width: 35%;
  margin-left: auto;
  margin-right: auto;
  /*margin-bottom: 20px;*/
  font-family:'Source-Han-Ligh9a55273ca1882e';
}

#password-input {
  width: 35%;
  margin-left: auto;
  margin-right: auto;
  font-family:'Source-Han-Ligh9a55273ca1882e';
}

#login-button {
  width: 55%;
  margin-left: auto;
  margin-right: auto;
}

#login-dialog {
  background-color: #F9FAFC;
}

.hint {
  color: #99A9BF;
  text-align: right;
  position: absolute;
  right: 20px;
}

#login-info-container {
  text-align: left;
  font-family: cursive;
  position: absolute;
  color: rgba(255, 255, 255, 0.5);
  left: 20px;
  bottom: 20px;
}
</style>
