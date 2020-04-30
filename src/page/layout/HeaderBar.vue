<template>
    <div class="sys-header">
        <div class="logo">
            <slot name="logo"></slot>
        </div>
        <slot name="topnav"></slot>
        <div class="userInfo">
            <ul>
                <li>
                    <el-dropdown @command="userOperation">
                        <span class="user">{{username}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="editPaw">{{$t('global.editpassword')}}</el-dropdown-item>
                            <el-dropdown-item command="logout">{{$t('global.logout')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li>
                    <span class="lang" :class="{cur: lang=='zhCN'}" @click="changeLang('zhCN')">中</span>
                    <span>/</span>
                    <span class="lang" :class="{cur: lang=='en'}" @click="changeLang('en')">EN</span>
                </li>
            </ul>
        </div>
        <el-dialog title="修改密码" :visible.sync="dialog.editPaw.show" :modal-append-to-body="false" custom-class="editPawDialog">
            <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px" >
                <el-form-item label="旧密码" prop="old_pass">
                    <el-input type="password" v-model="editPaw.old_pass" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="new_pass">
                    <el-input type="password" v-model="editPaw.new_pass" @paste.native.capture.prevent="handlePaste" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmNewPaw">
                    <el-input type="password" v-model="editPaw.confirmNewPaw" @paste.native.capture.prevent="handlePaste" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div class="textC">
                <el-button type="primary" @click="editPawSubmit">保存</el-button>
            </div>
        </el-dialog>
    </div>
    
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {modifyPwd} from '@/api/index'
export default {
    data() {
        return {
            dialog: {
                editPaw: {
                    show: false
                }
            },
            editPaw: {
                old_pass: '',
                new_pass: '',
                confirmNewPaw: ''
            },
            editPawRules: {
                old_pass: [
                    {required: true, message: '请输入旧密码', trigger: 'blur'}
                ],
                new_pass: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
                    {
                        // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            // if(!/^[a-z0-9]+$/.test(value)) {
                            //     console.log("不符合输入规则")
                            //     errors.push("请输入字母或特殊字符")
                            // }
                            callback(errors);
                        }
                    }
                ],
                confirmNewPaw: [
                    {required: true, message: '请再次输入新密码', trigger: 'blur'},
                    {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
                    {
                        // eslint-disable-next-line
                        validator(rule, value, callback, source, options) {
                            var errors = [];
                            // if(!/^[a-z0-9]+$/.test(value)) {
                            //     console.log("不符合输入规则")
                            //     errors.push("请输入字母或特殊字符")
                            // }
                            callback(errors);
                        }
                    }
                ]
            }
        }
    },
    computed: {
        ...mapState({
            username: state => state.user.name,
            lang: state => state.lang
        })
    },
    methods: {
        ...mapActions({
            sysLogout: 'auth/logout',
            loadLang: 'loadLang'
        }),
        changeLang(val) {
            if (val == this.lang) return
            // 改变语言后，因为表单校验的错误提示或者后台返回的信息等问题，需要进行页面刷新
            this.loadLang(val).then(() => {
                window.location.reload()
            })
        },
        userOperation(command){
            switch(command){
                case 'logout': 
                    this.logout()
                    break
                case 'editPaw':
                    this.dialog.editPaw.show = true
                    console.log('编辑密码')
                    break
            }
        },
        logout() {
            this.sysLogout().then(() => {
                location.reload()
                //this.$router.push('/login')
            })
        },
        editPawSubmit(){
            this.$refs.editPaw.validate((valid) => {
                if (valid) {
					if(this.editPaw.new_pass == this.editPaw.confirmNewPaw){
						modifyPwd(this.editPaw).then(res => {
						if (res.code == 200) {
						    this.$message({
						        message: '修改密码成功',
						        type: 'success'
						    })
						    this.$refs.editPaw.resetFields()
						    this.dialog.editPaw.show = false
						    } else {
						    this.$message({
						        message: res.error,
						        type: 'error'
						    })
						    }
						})
					}else{
						 this.$message({
						    message: '请确定新密码与再次确定密码一致',
						    type: 'warning'
						})
					}
                    

                    console.log("修改密码表单提交")
                } else {
                    console.log('error validate!!');
                    return false;
                }
            });
        }
    }
}
</script>