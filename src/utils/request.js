import Vue from 'vue'
import axios from 'axios'
const qs = require('qs')

// 基础路径 "http://localhost:8080"
axios.defaults.baseURL = '';
// 超时时间
axios.defaults.timeout = 180000

let noticeSign = true;

// 封装请求
export const request = async(type = 'POST', url = '', data = {}, postType, fileUpload) => {
    let result;
    type = type.toUpperCase();
    if (type === 'GET') {
        // 防止缓存
        data.t = new Date();
        await axios.get(url, {params: data, ...fileUpload}).then(res => {
            result = res.data;
        }).catch(err => {
            console.log('error', err);
        })
    } else if (type === 'POST') {
        if (postType) {
            await axios.post(url, qs.stringify(data)).then(res => {
                result = res.data;
            }).catch(err => {
                console.error('error', err); 
            })
        } else {
            await axios.post(url, data, fileUpload).then(res => {
                result = res.data;
            }).catch(err => {
                console.error('error', err); 
            })
        }
    }
    return result;
};

// 拦截器
let loadingDetail;
axios.interceptors.request.use(config => {
    // Do something before request is sent
    if (config.headers && config.headers["Loading-Close"]) {
        return config;
    }
    loadingDetail = Vue.prototype.$loading({
        lock: true,
        background: 'rgba(226, 226, 226, 0.5)'
    });
    return config;
},error => {
    // Do something with request error
    loadingDetail.close();
    window.vm.$notify({
        type: 'fail',
        message: '加载超时'
    });
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(response => {
    // Do something before response is sent
    noticeSign = true;
    if (loadingDetail) {
        loadingDetail.close();
    }
    return response;
},error => {
    // Do something with response error
    if (error.response) {
        if (window.vm.$store.state.isLogin) {
            window.vm.$state.isLogin = false;
        }
        switch (error.response.status) {
            case 460:
                noticeSign && window.vm.$notify({
                    type: 'error',
                    message: '未登录'
                });
                noticeSign = false;
                break;
            default:
                noticeSign && window.vm.$notify({
                    type: 'error',
                    message: '网络错误，请稍后再试'
                });
                noticeSign = false;
                break;
        }
    }
    return Promise.reject(error.response);
});