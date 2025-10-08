export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "computer", label: "computer" },
      { id: "laptop", label: "laptop" },
      { id: "MacBook", label: "MacBook" },
      { id: "accessories", label: "accessories" },
      { id: "Tablet", label: "Tablet" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "dell", label: "Dell" },
  { id: "hp", label: "HP" },
  { id: "lenovo", label: "Lenovo" },
  { id: "asus", label: "ASUS" },
  { id: "apple", label: "Apple" },
  { id: "acer", label: "Acer" },
  { id: "msi", label: "MSI" }
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "computer",
    label: "computer",
    path: "/shop/listing",
  },
  {
    id: "laptop",
    label: "laptop",
    path: "/shop/listing",
  },
  {
    id: "MacBook",
    label: "MacBook",
    path: "/shop/listing",
  },
  {
    id: "Tablet",
    label: "Tablet",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  computer: "computer",
  laptop: "laptop",
  MacBook: "MacBook",
  accessories: "Accessories",
  Tablet: "Tablet",
};

export const brandOptionsMap = {
 dell: "Dell",
  hp: "HP",
  lenovo: "Lenovo",
  asus: "ASUS",
  apple: "Apple",
  acer: "Acer",
  msi: "MSI"
};

export const filterOptions = {
  category: [
    { id: "computer", label: "computer" },
    { id: "laptop", label: "laptop" },
    { id: "MacBook", label: "MacBook" },
    { id: "accessories", label: "accessories" },
    { id: "Tablet", label: "Tablet" },
  ],
  brand: [
    { id: "dell", label: "Dell" },
  { id: "hp", label: "HP" },
  { id: "lenovo", label: "Lenovo" },
  { id: "asus", label: "ASUS" },
  { id: "apple", label: "Apple" },
  { id: "acer", label: "Acer" },
  { id: "msi", label: "MSI" }
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
