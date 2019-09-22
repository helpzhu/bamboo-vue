<template>
    <div class="mg">
        <el-form :inline="true" :model="queryParams" class="demo-form-inline">
            <el-form-item label="角色名称">
                <el-input v-model="queryParams.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getRoleList">查询</el-button>
                <el-button type="primary" @click="handleEdit('', 'insert')">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="roleInfList" :stripe="true" class="width100">
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="描述" prop="description"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="handleEdit(scope.row, 'edit')">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--    分页    -->
        <pagination v-show="totalSize>0" :total="totalSize" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getRoleList"/>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <el-form :model="roleInfoFrom" :rules="ruleRoleInfoFrom" ref="roleInfoFrom" size="small" label-width="auto"
                     class="demo-ruleForm">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleInfoFrom.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="textarea" v-model="roleInfoFrom.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllRoleList, insertRole, updateRole, deleteRole} from "../../api/role";
    import Pagination from "../../components/Pagination";

    export default {
        name: "roleList",
        components: {Pagination},
        data() {
            return {
                queryParams: {
                    pageNum: 1, // 当前页
                    pageSize: 10, // 每页显示数量
                    roleName: "" // 角色名称
                }, // 查询条件
                roleInfoFrom: {
                    roleId: "", // 角色id
                    roleName: "", // 角色名称
                    description: "", // 描述
                }, // 角色信息
                ruleRoleInfoFrom: {
                    roleName: [{required: true, message: '请填写角色名称', trigger: 'change'}],
                    description: [{required: true, message: '请填写描述信息', trigger: 'change'}],
                }, // 校验表单
                roleInfList: [], // 角色列表
                totalSize: 0, // 总行数
                dialogVisible: false,// 新增/编辑弹窗是否显示
                dialogTitle: '', // 弹窗标题
                dialogType: '', // 弹窗操作类型
            };
        },
        created() {
            this.getRoleList();
        },
        methods: {
            getRoleList() {
                getAllRoleList(this.queryParams).then(res => {
                    console.log("角色列表", res);
                    if (res.result == "success") {
                        this.roleInfList = res.data;
                        // 总行数
                        this.totalSize = res.totalRows;
                        // 当前页
                        this.queryParams.pageNum = res.pageNum;
                        // 每页行数
                        this.queryParams.pageSize = res.pageSize;
                    } else {
                        this.$notify({
                            type: "error",
                            message: res.message
                        });
                    }
                })
                    .catch(err => {
                        console.log("查询角色信息出错", err);
                    });
            },
            // 编辑角色信息初始化
            handleEdit(row, type) {
                if (type == 'edit') {
                    this.roleInfoFrom = {...row};
                    this.dialogTitle = '编辑角色';
                    this.dialogType = 'edit';
                } else {
                    this.roleInfoFrom = {
                        roleId: "", // 角色id
                        roleName: "", // 角色名称
                        description: "", // 描述
                    };
                    this.dialogTitle = '新增角色';
                    this.dialogType = 'insert';
                }
                this.dialogVisible = true;
            },
            // 编辑角色信息提交
            handleEditSubmit() {
                this.$refs['roleInfoFrom'].validate((valid) => {
                    if (valid) {
                        if (this.dialogType == 'edit') {
                            updateRole(this.roleInfoFrom).then(res => {
                                if (res.result == 'success') {
                                    this.$notify({type: 'success', message: '修改成功'});
                                    this.dialogVisible = false;
                                    this.getRoleList();
                                } else {
                                    this.$notify({type: 'error', message: res.message});
                                }
                            })
                        } else {
                            insertRole(this.roleInfoFrom).then(res => {
                                if (res.result == 'success') {
                                    this.$notify({type: 'success', message: '添加成功'});
                                    this.dialogVisible = false;
                                    this.getRoleList();
                                } else {
                                    this.$notify({type: 'error', message: res.message});
                                }
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 删除角色信息
            handleDelete(row) {
                this.$confirm("请确认是否删除角色信息?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    deleteRole({roleId: row.roleId}).then(res => {
                        if (res.result == 'success') {
                            this.$notify({type: 'success', message: '删除成功'})
                            this.getRoleList();
                        } else {
                            this.$notify({type: 'error', message: res.message})
                        }
                    })
                }).catch(() => {
                });
            }
        }
    };
</script>

<style scoped>
</style>