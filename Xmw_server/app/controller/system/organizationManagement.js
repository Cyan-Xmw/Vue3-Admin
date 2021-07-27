/*
 * @Description: 组织管理API接口
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-07-15 15:00:42
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-07-26 16:59:36
 */
'use strict';

const Controller = require('egg').Controller;
class OrganizationManagementController extends Controller {

    /**
     * @description: 获取组织树结构
     * @param {*} 
     * @return {*}
     */
    async getOrganizationTree() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { org_name, org_code } = ctx.params;
            // 根据条件拼接筛选
            let conditions = 'where 1 = 1'
            if (org_name) conditions += ` and org_name like '%${org_name}%'`
            if (org_code) conditions += ` and org_code like '%${org_code}%'`
            let data = await Raw.QueryList(`select * from xmw_organization ${conditions} order by create_time desc`);
            const result = ctx.helper.initializeTree(data, 'org_id', 'parent_id', 'children')
            return ctx.body = { resCode: 200, resMsg: '操作成功!', response: result }
        } catch (error) {
            ctx.logger.info('getOrganizationTree方法报错：' + error)
            return ctx.body = { resCode: 400, resMsg: '操作失败!', response: error }
        }
    }

    /**
     * @description: 新增和更新组织
     * @param {*} params:表单数据
     * @return {*}
     */
    async organizationSave() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { org_id, ...params } = ctx.params
            // 判断父级不能是自己
            if (params.parent_id == org_id && org_id) {
                return ctx.body = { resCode: -1, resMsg: '父级不能是自己!', response: {} }
            }
            // 判断部门名称和部门编码是否已存在
            let conditions = `where (org_name = '${params.org_name}' or org_code = '${params.org_code}')`
            if (org_id) conditions += ` and org_id != '${org_id}'`
            const exist = await Raw.Query(`select count(1) as total from xmw_organization ${conditions}`);
            if (exist.total) {
                return ctx.body = { resCode: -1, resMsg: '组织名称或组织编码已存在!', response: {} }
            }
            // 参数org_id判断是新增还是编辑
            if (!org_id) {
                params.org_id = ctx.helper.snowflakeId()
                params.create_time = new Date()
                await Raw.Insert('xmw_organization', params);
            } else { // 编辑字典
                params.update_last_time = new Date()
                const options = {
                    wherestr: `where org_id = ${org_id}`
                };
                await Raw.Update('xmw_organization', params, options);
            }
            return ctx.body = { resCode: 200, resMsg: '操作成功!', response: {} }
        } catch (error) {
            ctx.logger.info('organizationSave方法报错：' + error)
            return ctx.body = { resCode: 400, resMsg: '操作失败!', response: error }
        }
    }

    /**
     * @description: 删除组织
     * @param {*} ids:id集合,用,分隔
     * @return {*}
     */
    async organizationDel() {
        const { app, ctx } = this;
        const { Raw } = app.Db.xmw;
        try {
            let { ids } = ctx.params
            // 判断当前组织是否存在子级
            let conditions = `where parent_id = '${ids}'`
            const exist = await Raw.Query(`select count(1) as total from xmw_organization ${conditions}`);
            if (exist.total) {
                return ctx.body = { resCode: -1, resMsg: '当前组织存在子级,不能删除!', response: {} }
            }
            await Raw.Delete("xmw_organization", {
                wherestr: `where org_id in (${ids})`
            });
            return ctx.body = { resCode: 200, resMsg: '操作成功!', response: {} }
        } catch (error) {
            ctx.logger.info('organizationDel方法报错：' + error)
            return ctx.body = { resCode: 400, resMsg: '操作失败!', response: error }
        }
    }
}
module.exports = OrganizationManagementController;
