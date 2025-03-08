import { 
    Create,
   
    DeleteButton, 
   
    PasswordInput,
    EmailField,
  
    email,
    BooleanField,
    BooleanInput,
    
   
    useRecordContext
} from 'react-admin';
import { useParams } from 'react-router-dom';

interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    street: string;
    streetNumber: string;
    zipCode: string;
    locality: string;
    country: string;
}

interface UserData {
    userName: string;
    userPassword?: string;  // optional for update
    active: number;
    userDetails: UserDetails;
    role: {
        roleName: string;
    };
}

export const UserList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="userName" label="Tên đăng nhập" />
            {/* <BooleanField source="active" label="Trạng thái" /> */}
            <TextField source="userDetails.firstName" label="Tên" />
            <TextField source="userDetails.lastName" label="Họ" />
            <EmailField source="userDetails.email" label="Email" />
            <TextField source="userDetails.phoneNumber" label="Số điện thoại" />
            <TextField source="userDetails.street" label="Đường" />
            <TextField source="userDetails.streetNumber" label="Số nhà" />
            <TextField source="userDetails.zipCode" label="Mã bưu điện" />
            <TextField source="userDetails.locality" label="Thành phố" />
            <TextField source="userDetails.country" label="Quốc gia" />
            <TextField source="role.roleName" label="Vai trò" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const UserCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    const handleSubmit = async (values: any) => {
        try {
            const userData: UserData = {
                userName: values.userName,
                userPassword: values.userPassword,
                active: 1,
                userDetails: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    street: values.street || '',
                    streetNumber: values.streetNumber || '',
                    zipCode: values.zipCode || '',
                    locality: values.locality || '',
                    country: values.country || ''
                },
                role: {
                    roleName: "ROLE_USER"
                }
            };

            console.log('Sending registration data:', userData);

            const result = await dataProvider.create('users', { data: userData });
            console.log('Registration success:', result);
            notify('Tạo người dùng thành công', { type: 'success' });
            redirect('list', 'users');
        } catch (error: any) {
            console.error('Registration error:', error);
            notify(error.message || 'Có lỗi xảy ra khi tạo người dùng', { type: 'error' });
        }
    };

    return (
        <Create>
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput source="userName" label="Tên đăng nhập" validate={[required()]} />
                <PasswordInput source="userPassword" label="Mật khẩu" validate={[required()]} />
                <TextInput source="firstName" label="Tên" validate={[required()]} />
                <TextInput source="lastName" label="Họ" validate={[required()]} />
                <TextInput source="email" label="Email" validate={[required(), email()]} />
                <TextInput source="phoneNumber" label="Số điện thoại" validate={[required()]} />
                <TextInput source="street" label="Đường" />
                <TextInput source="streetNumber" label="Số nhà" />
                <TextInput source="zipCode" label="Mã bưu điện" />
                <TextInput source="locality" label="Thành phố" />
                <TextInput source="country" label="Quốc gia" />
            </SimpleForm>
        </Create>
    );
};

export const UserEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { id } = useParams(); // Lấy id từ URL params
    const dataProvider = useDataProvider();

    const handleSubmit = async (values: any) => {
        try {
            if (!id) {
                throw new Error('Không tìm thấy ID người dùng');
            }

            console.log('Values received:', values);

            const userData: UserData = {
                id: parseInt(id),
                userName: values.userName,
                active: values.active ? 1 : 0,
                userDetails: {
                    id: parseInt(values.userDetails?.id),
                    firstName: values.userDetails.firstName,
                    lastName: values.userDetails.lastName,
                    email: values.userDetails.email,
                    phoneNumber: values.userDetails.phoneNumber,
                    street: values.userDetails.street || '',
                    streetNumber: values.userDetails.streetNumber || '',
                    zipCode: values.userDetails.zipCode || '',
                    locality: values.userDetails.locality || '',
                    country: values.userDetails.country || ''
                },
                role: {
                    id: parseInt(values.role?.id),
                    roleName: values.role.roleName || "ROLE_USER"
                }
            };

            if (values.userPassword) {
                userData.userPassword = values.userPassword;
            }

            console.log('Cập nhật thông tin người dùng:', userData);

            const result = await dataProvider.update('users', { id: parseInt(id), data: userData });
            console.log('Update success:', result);
            notify('Cập nhật người dùng thành công', { type: 'success' });
            redirect('list', 'users');
        } catch (error: any) {
            console.error('Lỗi cập nhật:', error);
            notify(error.message || 'Có lỗi xảy ra khi cập nhật người dùng', { type: 'error' });
        }
    };

    return (
        <Edit mutationMode="pessimistic">
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput disabled source="id" />
                <TextInput source="userName" label="Tên đăng nhập" validate={[required()]} />
                <PasswordInput source="userPassword" label="Mật khẩu mới (để trống nếu không đổi)" />
                <BooleanInput source="active" label="Kích hoạt" />
                <TextInput source="userDetails.firstName" label="Tên" validate={[required()]} />
                <TextInput source="userDetails.lastName" label="Họ" validate={[required()]} />
                <TextInput source="userDetails.email" label="Email" validate={[required(), email()]} />
                <TextInput source="userDetails.phoneNumber" label="Số điện thoại" validate={[required()]} />
                <TextInput source="userDetails.street" label="Đường" />
                <TextInput source="userDetails.streetNumber" label="Số nhà" />
                <TextInput source="userDetails.zipCode" label="Mã bưu điện" />
                <TextInput source="userDetails.locality" label="Thành phố" />
                <TextInput source="userDetails.country" label="Quốc gia" />
                <TextInput source="role.id" label="ID Vai trò" disabled />
                <TextInput source="role.roleName" label="Vai trò" defaultValue="ROLE_USER" />
            </SimpleForm>
        </Edit>
    );
};

import { 
    Datagrid, 
    Edit, 
    EditButton, 
    List, 
    SimpleForm, 
    TextField, 
    DateField,
    NumberField,
    ReferenceField,
    SelectInput,
    useNotify,
    useRedirect,
    useDataProvider,
    TextInput,
    required
} from 'react-admin';

export const OrderList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <DateField source="orderedDate" label="Ngày đặt hàng" />
            <TextField source="status" label="Trạng thái" />
            <NumberField 
                source="total" 
                label="Tổng tiền"
                options={{ 
                    style: 'currency', 
                    currency: 'VND',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }} 
            />
            <TextField source="user.userName" label="Người đặt" />
            <EditButton/>
        </Datagrid>
    </List>
);

export const OrderEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const dataProvider = useDataProvider();

    const handleSubmit = async (values: any) => {
        try {
            const result = await dataProvider.update('orders', {
                id: values.id,
                data: {
                    id: values.id,
                    status: values.status,
                    orderedDate: values.orderedDate,
                    total: values.total,
                    userName: values.userName
                }
            });
            notify('Cập nhật đơn hàng thành công', { type: 'success' });
            redirect('list', 'orders');
        } catch (error: any) {
            notify(error.message || 'Có lỗi xảy ra khi cập nhật đơn hàng', { type: 'error' });
        }
    };

    return (
        <Edit mutationMode="pessimistic">
            <SimpleForm onSubmit={handleSubmit}>
                <TextInput disabled source="id" />
                <DateField source="orderedDate" label="Ngày đặt hàng" />
                <SelectInput 
                    source="status" 
                    label="Trạng thái"
                    choices={[
                        { id: 'PENDING', name: 'Chờ xử lý' },
                        { id: 'PROCESSING', name: 'Đang xử lý' },
                        { id: 'SHIPPED', name: 'Đã giao hàng' },
                        { id: 'DELIVERED', name: 'Đã nhận hàng' },
                        { id: 'CANCELLED', name: 'Đã hủy' },
                        { id: 'PAID', name: 'Đã thanh toán' }
                    ]}
                    validate={[required()]}
                />
                <NumberField 
                    source="total" 
                    label="Tổng tiền"
                    options={{ 
                        style: 'currency', 
                        currency: 'VND',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                    }} 
                />
                <TextField source="userName" label="Người đặt" />
            </SimpleForm>
        </Edit>
    );
};
