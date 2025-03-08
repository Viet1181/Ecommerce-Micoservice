import { 
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    useNotify,
    useRedirect,
    useDataProvider,
    DeleteButton,
    TextInput,
    required,
    Show,
    SimpleShowLayout,
    ArrayField,
    SingleFieldList,
    ChipField
} from 'react-admin';

export const CartList = () => (
    <List>
        <Datagrid rowClick="show">
            <TextField source="cartId" label="Mã giỏ hàng" />
            <TextField source="userId" label="Mã người dùng" />
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
            <ArrayField source="items" label="Sản phẩm">
                <SingleFieldList>
                    <ChipField source="product.productName" />
                </SingleFieldList>
            </ArrayField>
            <DeleteButton />
        </Datagrid>
    </List>
);

export const CartShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="cartId" label="Mã giỏ hàng" />
            <TextField source="userId" label="Mã người dùng" />
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
            <ArrayField source="items" label="Sản phẩm trong giỏ">
                <Datagrid>
                    <TextField source="product.productName" label="Tên sản phẩm" />
                    <NumberField 
                        source="product.price" 
                        label="Đơn giá"
                        options={{ 
                            style: 'currency', 
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }} 
                    />
                    <NumberField source="quantity" label="Số lượng" />
                    <NumberField 
                        source="subTotal" 
                        label="Thành tiền"
                        options={{ 
                            style: 'currency', 
                            currency: 'VND',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                        }} 
                    />
                </Datagrid>
            </ArrayField>
        </SimpleShowLayout>
    </Show>
);