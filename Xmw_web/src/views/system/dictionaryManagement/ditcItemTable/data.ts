/*
 * @Description: 
 * @Version: 3.30
 * @Autor: Xie Mingwei
 * @Date: 2021-07-19 16:02:46
 * @LastEditors: Xie Mingwei
 * @LastEditTime: 2021-07-27 16:36:27
 */
import { BasicColumn, FormSchema } from '/@/components/Table';

export const columns: BasicColumn[] = [
    {
        title: '字典标签',
        dataIndex: 'dictionary_label',
    },
    {
        title: '字典键值',
        dataIndex: 'dictionary_value',
    },
    {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        slots: { customRender: 'status' },
    },
    {
        title: '排序',
        dataIndex: 'sort',
        width: 80,
        defaultHidden: true
    },
    {
        title: '备注',
        dataIndex: 'remark',
        defaultHidden: true
    },
];

export const dataFormSchema: FormSchema[] = [
    {
        field: 'dictionary_label',
        label: '字典标签',
        component: 'Input',
        colProps: { lg: 24, md: 24 },
        required: true,
        componentProps: {
            placeholder: '请输入字典标签',
            maxLength: 32
        },
    },
    {
        field: 'dictionary_value',
        label: '字典键值',
        component: 'Input',
        colProps: { lg: 24, md: 24 },
        required: true,
        componentProps: {
            placeholder: '请输入字典键值',
            maxLength: 32
        },
    },
    {
        field: 'status',
        label: '状态',
        component: 'RadioGroup',
        required: true,
        defaultValue: '1'
    },
    {
        field: 'sort',
        label: '排序',
        component: 'InputNumber',
        required: true,
        defaultValue: '1',
        componentProps: {
            placeholder: '请输入排序',
            min: 1,
            style: { width: '100%' }
        },
    },
    {
        label: '备注',
        field: 'remark',
        component: 'InputTextArea',
        colProps: { lg: 24, md: 24 },
        componentProps: {
            placeholder: '请输入备注',
            rows: 4,
            maxLength: 200
        },
    },
];
