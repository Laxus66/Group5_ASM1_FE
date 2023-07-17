import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Iproducts } from '../../types/products';
import { Button, Form, Input, notification, Select } from 'antd';
import { ICategories } from '../../types/categories';

interface IProps {
    products: Iproducts[];
    category: ICategories[];
    onUpdate: (product: Iproducts) => void;
}

const UpdateProduct: React.FC<IProps> = (props: IProps) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Iproducts | undefined>();
    useEffect(() => {
        const currentProduct = props.products.find(
            (product: Iproducts) => product.id === Number(id)
        );
        setProduct(currentProduct);
    }, [props, id]);

    const [form] = Form.useForm();

    useEffect(() => {
        if (product) {
            form.setFieldsValue({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                description: product.description,
                category: product.categoryId,
            });
        }
    }, [product, form]);

    const onFinish = (values: any) => {
        const updatedProduct: Iproducts = {
            ...product!,
            name: values.name,
            price: values.price,
            image: values.image,
            description: values.description,
            categoryId: values.category,
        };
        props.onUpdate(updatedProduct);
        navigate('/admin/products');
        notification.success({
            message: 'Update Successful',
            description: `The product ${values.name} has been updated.`,
            duration: 2,
        });
    };

    return (
        <div>
            <Form
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 500, margin: '0 auto' }}
                onFinish={onFinish}
            >
                <Form.Item label="" name="id" style={{ display: 'none' }}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[
                        { required: true, message: 'Please input the product name!' },
                        { min: 5, message: 'Product name must be at least 5 characters.' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        { required: true, message: 'Please input the product price!' },
                        {
                            validator: (_, value) => {
                                if (!value || !isNaN(Number(value))) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Price must be a number.');
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Image"
                    name="image"
                    rules={[
                        { required: true, message: 'Please input the image URL!' },
                        {
                            validator: (_, value) => {
                                const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                                if (urlRegex.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Image must be a valid URL.');
                            },
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select placeholder="Select a category">
                        {props.category.map((cateID: ICategories) => (
                            <Select.Option key={cateID.id} value={cateID.id}>
                                {cateID.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Update Product
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateProduct;
