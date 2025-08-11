# 🛒 SUPERKART PROJECT - COMPREHENSIVE TECHNICAL CONCEPTS GUIDE

## TABLE OF CONTENTS
1. [React.js Concepts](#reactjs-concepts)
2. [Spring Boot Concepts](#spring-boot-concepts)
3. [Hibernate & JPA Concepts](#hibernate--jpa-concepts)
4. [MySQL Database Concepts](#mysql-database-concepts)
5. [Integration Patterns](#integration-patterns)
6. [Advanced Features](#advanced-features)

---

## REACT.JS CONCEPTS

### 1. MODERN REACT FEATURES

#### **Functional Components with Hooks**
```jsx
// useState Hook for state management
const [product, setProduct] = useState({
  name: "",
  price: "",
  inventory: ""
});

// useEffect Hook for side effects
useEffect(() => {
  dispatch(getProductById(productId));
  dispatch(setQuantity(1));
}, [dispatch, productId]);

// Custom Hooks
const useCart = (userId) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  
  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);
  
  return cart;
};
```

#### **React Context & Redux Integration**
```jsx
// Redux Provider Setup
import { Provider } from 'react-redux';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

// useSelector & useDispatch Hooks
const ProductDetails = () => {
  const dispatch = useDispatch();
  const { product, quantity } = useSelector((state) => state.product);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  const handleAddToCart = async () => {
    await dispatch(addToCart({ productId, quantity })).unwrap();
  };
};
```

### 2. COMPONENT ARCHITECTURE

#### **Higher-Order Components (HOCs)**
```jsx
// Protected Route HOC
const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userRoles = useSelector((state) => state.auth.roles);
  
  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  
  const isAuthorized = userRoles.some((userRole) =>
    allowedRoles.includes(userRole)
  );
  
  return isAuthorized ? (useOutlet ? <Outlet /> : children) : <Navigate to='/unauthorized' />;
};
```

#### **Compound Components Pattern**
```jsx
// Reusable Form Components
const AddressForm = ({ address, onChange, onRemove, showRemove = true }) => {
  return (
    <div className="address-form">
      <Form.Group>
        <Form.Label>Street Address</Form.Label>
        <Form.Control
          type="text"
          name="street"
          value={address.street}
          onChange={(e) => onChange(e)}
          required
        />
      </Form.Group>
      {/* More form fields */}
    </div>
  );
};
```

### 3. ADVANCED REACT PATTERNS

#### **Render Props Pattern**
```jsx
// Image Zoom Component with Render Props
const ImageZoomify = ({ productId }) => {
  const [productImg, setProductImg] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        const response = await fetch(`/api/v1/images/image/download/${id}`);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setProductImg(reader.result);
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductImage(productId);
  }, [productId]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ImageZoom>
      <img src={productImg} alt='Product image' className='resized-image' />
    </ImageZoom>
  );
};
```

#### **Custom Hooks**
```jsx
// Custom Hook for Authentication
const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, token, roles } = useSelector(state => state.auth);
  
  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      return { success: true, user: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [dispatch]);
  
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);
  
  return { isAuthenticated, token, roles, login, logout };
};
```

### 4. REACT ROUTER CONCEPTS

#### **Nested Routing with Outlet**
```jsx
// App.jsx - Router Configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path='/products' element={<Products />} />
      <Route path='/products/:name' element={<Products />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute useOutlet={true} allowedRoles={["ROLE_USER"]} />}>
        <Route path='/user/:userId/my-cart' element={<Cart />} />
        <Route path='/user-profile/:userId/profile' element={<UserProfile />} />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute useOutlet={true} allowedRoles={["ROLE_ADMIN"]} />}>
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/admin/orders' element={<AdminOrders />} />
      </Route>
    </Route>
  )
);
```

#### **Programmatic Navigation**
```jsx
// useNavigate Hook
const Checkout = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  const handlePaymentSuccess = () => {
    navigate(`/order-confirmation/${orderId}`);
  };
  
  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };
};
```

### 5. PERFORMANCE OPTIMIZATION

#### **React.memo & useMemo**
```jsx
// Memoized Component
const ProductCard = React.memo(({ product, onAddToCart }) => {
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(product.price);
  }, [product.price]);
  
  return (
    <Card className="product-card">
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{formattedPrice}</Card.Text>
        <Button onClick={() => onAddToCart(product.id)}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
});
```

#### **useCallback for Function Memoization**
```jsx
const Products = () => {
  const [sortBy, setSortBy] = useState('relevance');
  
  const sortProducts = useCallback((products, sortBy) => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  }, []);
  
  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortBy);
  }, [products, sortBy, sortProducts]);
};
```

### 6. FORM HANDLING & VALIDATION

#### **Controlled Components**
```jsx
const UserRegistration = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  
  const [addresses, setAddresses] = useState([{
    country: "",
    state: "",
    city: "",
    street: "",
    mobileNumber: "",
    addressType: "HOME",
  }]);
  
  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setAddresses(updatedAddresses);
  };
};
```

---

## SPRING BOOT CONCEPTS

### 1. SPRING BOOT ARCHITECTURE

#### **Main Application Class**
```java
@SpringBootApplication
public class KartECommerceApplication {
    public static void main(String[] args) {
        SpringApplication.run(KartECommerceApplication.class, args);
    }
}
```

#### **Auto-Configuration**
```properties
# application.properties
spring.application.name=Kart E-Commerce
server.port=9090

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3307/kart_ecommerce
spring.datasource.username=root
spring.datasource.password=Ishwar4477@
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
auth.token.jwtSecret=36763979244226452948404D635166546A576D5A7134743777217A25432A462D
auth.token.accessExpirationInMils=120000
auth.token.refreshExpirationInMils=300000

# Stripe Configuration
stripe.secret.key=your_stripe_secret_key_here
```

### 2. DEPENDENCY INJECTION & IOC

#### **Component Scanning & Bean Creation**
```java
@Configuration
public class ShopConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
```

#### **Dependency Injection Patterns**
```java
@Service
@RequiredArgsConstructor // Lombok for constructor injection
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;
    
    // Constructor injection automatically handled by @RequiredArgsConstructor
}

// Field Injection (Alternative)
@Component
public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private ShopUserDetailsService userDetailsService;
}
```

### 3. REST API DEVELOPMENT

#### **RESTful Controllers**
```java
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private final IProductService productService;
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        List<ProductDto> convertedProducts = productService.getConvertedProducts(products);
        return ResponseEntity.ok(new ApiResponse("Found", convertedProducts));
    }
    
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addProduct(@Valid @RequestBody AddProductRequest request) {
        Product product = productService.addProduct(request);
        ProductDto productDto = productService.convertToDto(product);
        return ResponseEntity.ok(new ApiResponse("Product added successfully!", productDto));
    }
    
    @PutMapping("/product/{productId}/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductUpdateRequest request) {
        Product updatedProduct = productService.updateProduct(request, productId);
        ProductDto productDto = productService.convertToDto(updatedProduct);
        return ResponseEntity.ok(new ApiResponse("Product updated successfully!", productDto));
    }
}
```

#### **Request/Response DTOs**
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private Integer discountPercentage;
    private boolean isOnSale;
    private int inventory;
    private String description;
    private CategoryDto category;
    private List<ImageDto> images;
}

@Data
public class ApiResponse {
    private String message;
    private Object data;
    private LocalDateTime timestamp;
    
    public ApiResponse(String message, Object data) {
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }
}
```

### 4. SPRING SECURITY IMPLEMENTATION

#### **Security Configuration**
```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity(prePostEnabled = true)
public class ShopConfig {
    private final ShopUserDetailsService userDetailsService;
    private final JwtEntryPoint authEntryPoint;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_URLS.toArray(String[]::new)).permitAll()
                .requestMatchers(SECURED_URLS.toArray(String[]::new)).authenticated()
                .anyRequest().permitAll());
                
        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
```

#### **JWT Token Management**
```java
@Component
public class JwtUtils {
    @Value("${auth.token.jwtSecret}")
    private String jwtSecret;
    
    @Value("${auth.token.accessExpirationInMils}")
    private String expirationTime;
    
    public String generateAccessTokenForUser(Authentication authentication) {
        ShopUserDetails userPrincipal = (ShopUserDetails) authentication.getPrincipal();
        
        List<String> roles = userPrincipal.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id", userPrincipal.getId())
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(calculateExpirationDate(expirationTime))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException | 
                 SignatureException | IllegalArgumentException e) {
            throw new JwtException("Invalid or expired token");
        }
    }
}
```

### 5. EXCEPTION HANDLING

#### **Global Exception Handler**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityExistsException.class)
    public ResponseEntity<String> handleAlreadyExists(EntityExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneral(Exception ex) {
        return new ResponseEntity<>("Error: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

### 6. VALIDATION

#### **Bean Validation**
```java
@Entity
public class Product {
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price format is invalid")
    private BigDecimal price;
    
    @Min(value = 0, message = "Inventory cannot be negative")
    private int inventory;
    
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Email is required")
    private String email;
}
```

---

## HIBERNATE & JPA CONCEPTS

### 1. ENTITY MAPPING

#### **Basic Entity Configuration**
```java
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String brand;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "original_price", precision = 10, scale = 2)
    private BigDecimal originalPrice;
    
    @Column(name = "discount_percentage")
    private Integer discountPercentage;
    
    @Column(name = "is_on_sale")
    private boolean isOnSale;
    
    @Column(nullable = false)
    private int inventory;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### 2. RELATIONSHIP MAPPING

#### **One-to-Many & Many-to-One**
```java
// Product to Images (One-to-Many)
@Entity
public class Product {
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Image> images = new ArrayList<>();
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}

// Image Entity (Many-to-One)
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String fileName;
    private String fileType;
    private String downloadUrl;
    
    @Lob
    private Blob image;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}
```

#### **One-to-One Relationship**
```java
// User to Cart (One-to-One)
@Entity
public class User {
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;
}

@Entity
public class Cart {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;
}
```

#### **Many-to-Many Relationship**
```java
// User to Roles (Many-to-Many)
@Entity
public class User {
    @ManyToMany(fetch = FetchType.EAGER, cascade = {
            CascadeType.DETACH, CascadeType.MERGE, 
            CascadeType.PERSIST, CascadeType.REFRESH
    })
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    private Collection<Role> roles = new HashSet<>();
}
```

### 3. ADVANCED MAPPING FEATURES

#### **Embedded Objects**
```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String state;
    private String country;
    private String zipCode;
}

@Entity
public class User {
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "street", column = @Column(name = "billing_street")),
        @AttributeOverride(name = "city", column = @Column(name = "billing_city"))
    })
    private Address billingAddress;
}
```

#### **Inheritance Mapping**
```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "address_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String street;
    private String city;
    private String state;
}

@Entity
@DiscriminatorValue("HOME")
public class HomeAddress extends Address {
    private boolean isDefault;
}

@Entity
@DiscriminatorValue("OFFICE")
public class OfficeAddress extends Address {
    private String companyName;
}
```

### 4. LIFECYCLE CALLBACKS

#### **Entity Lifecycle Hooks**
```java
@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String orderNumber;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        if (orderNumber == null) {
            orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    @PostLoad
    public void postLoad() {
        // Perform actions after entity is loaded from database
    }
}
```

### 5. REPOSITORY PATTERNS

#### **Spring Data JPA Repositories**
```java
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Derived Query Methods
    List<Product> findByCategoryName(String categoryName);
    List<Product> findByBrandAndPriceBetween(String brand, BigDecimal minPrice, BigDecimal maxPrice);
    List<Product> findByNameContainingIgnoreCase(String name);
    boolean existsByNameAndBrand(String name, String brand);
    
    // Custom JPQL Queries
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameCustom(@Param("name") String name);
    
    @Query("SELECT p FROM Product p JOIN FETCH p.category JOIN FETCH p.images WHERE p.category.id = :categoryId")
    List<Product> findProductsWithDetailsByCategoryId(@Param("categoryId") Long categoryId);
    
    // Native SQL Queries
    @Query(value = "SELECT * FROM products p WHERE p.inventory < :threshold", nativeQuery = true)
    List<Product> findLowStockProducts(@Param("threshold") int threshold);
    
    // Modifying Queries
    @Modifying
    @Query("UPDATE Product p SET p.inventory = p.inventory - :quantity WHERE p.id = :productId")
    int reduceInventory(@Param("productId") Long productId, @Param("quantity") int quantity);
}
```

#### **Custom Repository Implementation**
```java
// Custom Repository Interface
public interface ProductRepositoryCustom {
    List<Product> findProductsWithComplexCriteria(ProductSearchCriteria criteria);
}

// Custom Repository Implementation
@Repository
public class ProductRepositoryCustomImpl implements ProductRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Product> findProductsWithComplexCriteria(ProductSearchCriteria criteria) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> product = query.from(Product.class);
        
        List<Predicate> predicates = new ArrayList<>();
        
        if (criteria.getName() != null) {
            predicates.add(cb.like(cb.lower(product.get("name")), 
                "%" + criteria.getName().toLowerCase() + "%"));
        }
        
        if (criteria.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(product.get("price"), criteria.getMinPrice()));
        }
        
        if (criteria.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(product.get("price"), criteria.getMaxPrice()));
        }
        
        query.where(predicates.toArray(new Predicate[0]));
        return entityManager.createQuery(query).getResultList();
    }
}
```

### 6. TRANSACTION MANAGEMENT

#### **Declarative Transactions**
```java
@Service
@Transactional
public class OrderService implements IOrderService {
    
    @Transactional(rollbackFor = Exception.class)
    public Order placeOrder(Long userId) {
        // Multiple database operations in single transaction
        Cart cart = cartService.getCartByUserId(userId);
        Order order = createOrder(cart);
        List<OrderItem> orderItems = createOrderItems(order, cart);
        
        // If any operation fails, entire transaction rolls back
        order.setOrderItems(new HashSet<>(orderItems));
        order.setTotalAmount(calculateTotalAmount(orderItems));
        
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cart.getId());
        
        return savedOrder;
    }
    
    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(Long userId) {
        // Read-only transaction for better performance
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(this::convertToDto).toList();
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void updateInventory(Long productId, int quantity) {
        // High isolation level for critical operations
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        
        if (product.getInventory() < quantity) {
            throw new InsufficientInventoryException("Not enough inventory");
        }
        
        product.setInventory(product.getInventory() - quantity);
        productRepository.save(product);
    }
}
```

### 7. CACHING

#### **Second-Level Cache Configuration**
```java
// Entity-level caching
@Entity
@Cacheable
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String description;
}

// Query-level caching
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    @Query("SELECT c FROM Category c ORDER BY c.name")
    List<Category> findAllCategoriesCached();
}
```

---

## MYSQL DATABASE CONCEPTS

### 1. DATABASE SCHEMA DESIGN

#### **Table Creation & Constraints**
```sql
-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Products Table
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percentage INT DEFAULT 0,
    is_on_sale BOOLEAN DEFAULT FALSE,
    inventory INT NOT NULL DEFAULT 0,
    description TEXT,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category_brand (category_id, brand),
    INDEX idx_name_search (name),
    INDEX idx_price_range (price),
    CONSTRAINT chk_price_positive CHECK (price > 0),
    CONSTRAINT chk_inventory_non_negative CHECK (inventory >= 0)
);

-- Orders Table
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    order_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    order_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_orders (user_id, order_date),
    INDEX idx_status_date (order_status, order_date)
);
```

### 2. INDEXING STRATEGIES

#### **Performance Optimization Indexes**
```sql
-- Composite Indexes for Common Queries
CREATE INDEX idx_product_category_brand ON products(category_id, brand);
CREATE INDEX idx_product_price_inventory ON products(price, inventory);
CREATE INDEX idx_order_user_status ON orders(user_id, order_status);

-- Full-Text Search Index
CREATE FULLTEXT INDEX idx_product_search ON products(name, description);

-- Covering Index (includes all needed columns)
CREATE INDEX idx_product_list_covering ON products(category_id, name, price, inventory, is_on_sale);

-- Partial Index (with condition)
CREATE INDEX idx_active_products ON products(category_id, price) WHERE inventory > 0;
```

### 3. ADVANCED SQL QUERIES

#### **Complex Joins & Subqueries**
```sql
-- Products with Category and Image Count
SELECT 
    p.id,
    p.name,
    p.price,
    p.inventory,
    c.name as category_name,
    COUNT(i.id) as image_count,
    AVG(oi.price) as avg_selling_price
FROM products p
INNER JOIN categories c ON p.category_id = c.id
LEFT JOIN images i ON p.id = i.product_id
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE p.inventory > 0
GROUP BY p.id, p.name, p.price, p.inventory, c.name
HAVING COUNT(i.id) > 0
ORDER BY avg_selling_price DESC;

-- Users with Order Statistics
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    MAX(o.order_date) as last_order_date,
    (SELECT COUNT(*) FROM cart_items ci 
     JOIN carts c ON ci.cart_id = c.id 
     WHERE c.user_id = u.id) as current_cart_items
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.first_name, u.last_name, u.email
ORDER BY total_spent DESC;
```

#### **Window Functions**
```sql
-- Product Rankings within Categories
SELECT 
    p.id,
    p.name,
    p.price,
    c.name as category,
    ROW_NUMBER() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) as price_rank,
    RANK() OVER (PARTITION BY p.category_id ORDER BY p.inventory DESC) as inventory_rank,
    LAG(p.price) OVER (PARTITION BY p.category_id ORDER BY p.price) as prev_price,
    LEAD(p.price) OVER (PARTITION BY p.category_id ORDER BY p.price) as next_price
FROM products p
JOIN categories c ON p.category_id = c.id;

-- Running Totals for Orders
SELECT 
    order_date,
    total_amount,
    SUM(total_amount) OVER (ORDER BY order_date) as running_total,
    AVG(total_amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7_days
FROM orders
ORDER BY order_date;
```

### 4. STORED PROCEDURES & FUNCTIONS

#### **Business Logic in Database**
```sql
-- Stored Procedure for Order Processing
DELIMITER //
CREATE PROCEDURE ProcessOrder(
    IN p_user_id BIGINT,
    IN p_cart_id BIGINT,
    OUT p_order_id BIGINT,
    OUT p_result_message VARCHAR(255)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_product_id BIGINT;
    DECLARE v_quantity INT;
    DECLARE v_unit_price DECIMAL(10,2);
    DECLARE v_available_inventory INT;
    DECLARE v_total_amount DECIMAL(12,2) DEFAULT 0;
    
    DECLARE cart_cursor CURSOR FOR
        SELECT ci.product_id, ci.quantity, ci.unit_price
        FROM cart_items ci
        WHERE ci.cart_id = p_cart_id;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    START TRANSACTION;
    
    -- Create Order
    INSERT INTO orders (user_id, order_number, order_date, order_status, total_amount)
    VALUES (p_user_id, CONCAT('ORD-', UPPER(SUBSTRING(UUID(), 1, 8))), CURDATE(), 'PENDING', 0);
    
    SET p_order_id = LAST_INSERT_ID();
    
    -- Process Cart Items
    OPEN cart_cursor;
    read_loop: LOOP
        FETCH cart_cursor INTO v_product_id, v_quantity, v_unit_price;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Check Inventory
        SELECT inventory INTO v_available_inventory
        FROM products
        WHERE id = v_product_id;
        
        IF v_available_inventory < v_quantity THEN
            SET p_result_message = CONCAT('Insufficient inventory for product ID: ', v_product_id);
            ROLLBACK;
            LEAVE read_loop;
        END IF;
        
        -- Create Order Item
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (p_order_id, v_product_id, v_quantity, v_unit_price);
        
        -- Update Inventory
        UPDATE products 
        SET inventory = inventory - v_quantity
        WHERE id = v_product_id;
        
        -- Add to Total
        SET v_total_amount = v_total_amount + (v_quantity * v_unit_price);
    END LOOP;
    
    CLOSE cart_cursor;
    
    IF p_result_message IS NULL THEN
        -- Update Order Total
        UPDATE orders 
        SET total_amount = v_total_amount
        WHERE id = p_order_id;
        
        -- Clear Cart
        DELETE FROM cart_items WHERE cart_id = p_cart_id;
        
        SET p_result_message = 'Order processed successfully';
        COMMIT;
    END IF;
    
END//
DELIMITER ;
```

### 5. TRIGGERS

#### **Audit and Business Logic Triggers**
```sql
-- Audit Trigger for Product Changes
CREATE TABLE product_audit (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT,
    action_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //
CREATE TRIGGER product_audit_trigger
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    INSERT INTO product_audit (product_id, action_type, old_values, new_values, changed_by)
    VALUES (
        NEW.id,
        'UPDATE',
        JSON_OBJECT(
            'name', OLD.name,
            'price', OLD.price,
            'inventory', OLD.inventory
        ),
        JSON_OBJECT(
            'name', NEW.name,
            'price', NEW.price,
            'inventory', NEW.inventory
        ),
        USER()
    );
END//
DELIMITER ;

-- Inventory Alert Trigger
DELIMITER //
CREATE TRIGGER low_inventory_alert
AFTER UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.inventory <= 5 AND OLD.inventory > 5 THEN
        INSERT INTO inventory_alerts (product_id, alert_type, message, created_at)
        VALUES (NEW.id, 'LOW_STOCK', CONCAT('Product ', NEW.name, ' is low on stock (', NEW.inventory, ' remaining)'), NOW());
    END IF;
    
    IF NEW.inventory = 0 AND OLD.inventory > 0 THEN
        INSERT INTO inventory_alerts (product_id, alert_type, message, created_at)
        VALUES (NEW.id, 'OUT_OF_STOCK', CONCAT('Product ', NEW.name, ' is out of stock'), NOW());
    END IF;
END//
DELIMITER ;
```

### 6. PERFORMANCE OPTIMIZATION

#### **Query Optimization Techniques**
```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN FORMAT=JSON
SELECT p.name, p.price, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price BETWEEN 100 AND 1000
AND c.name = 'Electronics'
ORDER BY p.price;

-- Optimized query with proper indexing
SELECT /*+ USE_INDEX(p, idx_category_price) */ 
    p.name, p.price, c.name as category
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.category_id = (SELECT id FROM categories WHERE name = 'Electronics')
AND p.price BETWEEN 100 AND 1000
ORDER BY p.price;

-- Pagination with LIMIT and OFFSET optimization
SELECT p.id, p.name, p.price
FROM products p
WHERE p.id > 1000  -- Use WHERE instead of OFFSET for better performance
ORDER BY p.id
LIMIT 20;
```

---

## INTEGRATION PATTERNS

### 1. FRONTEND-BACKEND INTEGRATION

#### **API Client Configuration**
```javascript
// Axios Configuration with Interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1",
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor with Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        localStorage.setItem("authToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

### 2. STATE MANAGEMENT INTEGRATION

#### **Redux Toolkit with Async Thunks**
```javascript
// Product Slice with Async Operations
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    isLoading: false,
    error: null
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

// Async Thunk for API Integration
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 0, size = 10, categoryId }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        ...(categoryId && { categoryId: categoryId.toString() })
      });
      
      const response = await api.get(`/products?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);
```

### 3. DATABASE INTEGRATION PATTERNS

#### **Repository Pattern Implementation**
```java
// Custom Repository with Complex Queries
@Repository
public class ProductRepositoryImpl implements ProductRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Page<Product> findProductsWithFilters(ProductFilter filter, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> product = query.from(Product.class);
        
        // Join with Category for filtering
        Join<Product, Category> categoryJoin = product.join("category", JoinType.INNER);
        
        List<Predicate> predicates = buildPredicates(cb, product, categoryJoin, filter);
        
        if (!predicates.isEmpty()) {
            query.where(predicates.toArray(new Predicate[0]));
        }
        
        // Apply sorting
        if (pageable.getSort().isSorted()) {
            List<Order> orders = pageable.getSort().stream()
                .map(sort -> sort.isAscending() ? 
                    cb.asc(product.get(sort.getProperty())) : 
                    cb.desc(product.get(sort.getProperty())))
                .collect(Collectors.toList());
            query.orderBy(orders);
        }
        
        TypedQuery<Product> typedQuery = entityManager.createQuery(query);
        
        // Apply pagination
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());
        
        List<Product> products = typedQuery.getResultList();
        
        // Count query for total elements
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);
        countQuery.select(cb.count(countRoot));
        
        if (!predicates.isEmpty()) {
            // Rebuild predicates for count query
            List<Predicate> countPredicates = buildPredicates(cb, countRoot, 
                countRoot.join("category", JoinType.INNER), filter);
            countQuery.where(countPredicates.toArray(new Predicate[0]));
        }
        
        Long total = entityManager.createQuery(countQuery).getSingleResult();
        
        return new PageImpl<>(products, pageable, total);
    }
    
    private List<Predicate> buildPredicates(CriteriaBuilder cb, Root<Product> product, 
                                          Join<Product, Category> categoryJoin, ProductFilter filter) {
        List<Predicate> predicates = new ArrayList<>();
        
        if (filter.getName() != null && !filter.getName().trim().isEmpty()) {
            predicates.add(cb.like(cb.lower(product.get("name")), 
                "%" + filter.getName().toLowerCase() + "%"));
        }
        
        if (filter.getCategoryId() != null) {
            predicates.add(cb.equal(categoryJoin.get("id"), filter.getCategoryId()));
        }
        
        if (filter.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(product.get("price"), filter.getMinPrice()));
        }
        
        if (filter.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(product.get("price"), filter.getMaxPrice()));
        }
        
        if (filter.getBrands() != null && !filter.getBrands().isEmpty()) {
            predicates.add(product.get("brand").in(filter.getBrands()));
        }
        
        if (filter.getInStockOnly() != null && filter.getInStockOnly()) {
            predicates.add(cb.greaterThan(product.get("inventory"), 0));
        }
        
        return predicates;
    }
}
```

---

## ADVANCED FEATURES

### 1. SECURITY IMPLEMENTATION

#### **JWT Token Management**
```java
// JWT Utility Class with Refresh Token Support
@Component
public class JwtUtils {
    
    public String generateAccessTokenForUser(Authentication authentication) {
        ShopUserDetails userPrincipal = (ShopUserDetails) authentication.getPrincipal();
        
        return Jwts.builder()
                .setSubject(userPrincipal.getEmail())
                .claim("id", userPrincipal.getId())
                .claim("roles", userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException | UnsupportedJwtException | 
                 MalformedJwtException | SignatureException | IllegalArgumentException e) {
            logger.error("JWT validation error: {}", e.getMessage());
            return false;
        }
    }
}
```

### 2. FILE UPLOAD & STORAGE

#### **Image Management System**
```java
@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
        "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        validateFiles(files);
        
        Product product = productService.getProductById(productId);
        List<ImageDto> savedImages = new ArrayList<>();
        
        for (MultipartFile file : files) {
            try {
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setProduct(product);
                
                String downloadUrl = "/api/v1/images/image/download/" + image.getId();
                image.setDownloadUrl(downloadUrl);
                
                Image savedImage = imageRepository.save(image);
                savedImage.setDownloadUrl("/api/v1/images/image/download/" + savedImage.getId());
                imageRepository.save(savedImage);
                
                ImageDto imageDto = convertToDto(savedImage);
                savedImages.add(imageDto);
                
            } catch (IOException | SQLException e) {
                throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
            }
        }
        
        return savedImages;
    }
    
    private void validateFiles(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided for upload");
        }
        
        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Empty file detected");
            }
            
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("File size exceeds maximum limit of 10MB");
            }
            
            if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
                throw new IllegalArgumentException("File type not supported: " + file.getContentType());
            }
        }
    }
}
```

### 3. CACHING STRATEGIES

#### **Redis Integration (Configuration Ready)**
```java
// Cache Configuration
@Configuration
@EnableCaching
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        RedisCacheManager.Builder builder = RedisCacheManager
                .RedisCacheManagerBuilder
                .fromConnectionFactory(redisConnectionFactory())
                .cacheDefaults(cacheConfiguration());
        
        return builder.build();
    }
    
    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        return new LettuceConnectionFactory(new RedisStandaloneConfiguration("localhost", 6379));
    }
    
    private RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(10))
                .serializeKeysWith(RedisSerializationContext.SerializationPair
                    .fromSerializer(new StringRedisSerializer()))
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                    .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}

// Service with Caching
@Service
public class ProductService {
    
    @Cacheable(value = "products", key = "#productId")
    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void clearProductCache() {
        // Method to clear all product cache entries
    }
}
```

### 4. PAYMENT INTEGRATION

#### **Stripe Payment Processing**
```java
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    public String createPaymentIntent(PaymentRequest request) throws StripeException {
        // Convert amount to smallest currency unit (paisa for INR)
        long amountInSmallestUnit = Math.round(request.getAmount() * 100);
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInSmallestUnit)
                .setCurrency(request.getCurrency())
                .setDescription("SuperKart Order Payment")
                .putMetadata("orderId", request.getOrderId().toString())
                .putMetadata("userId", request.getUserId().toString())
                .setAutomaticPaymentMethods(
                    PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                        .setEnabled(true)
                        .build()
                )
                .build();
        
        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }
    
    @EventListener
    public void handleStripeWebhook(StripeWebhookEvent event) {
        switch (event.getType()) {
            case "payment_intent.succeeded":
                handlePaymentSuccess(event.getData());
                break;
            case "payment_intent.payment_failed":
                handlePaymentFailure(event.getData());
                break;
            default:
                logger.warn("Unhandled webhook event type: {}", event.getType());
        }
    }
    
    private void handlePaymentSuccess(PaymentIntent paymentIntent) {
        String orderId = paymentIntent.getMetadata().get("orderId");
        if (orderId != null) {
            orderService.updateOrderStatus(Long.valueOf(orderId), OrderStatus.PROCESSING);
        }
    }
}
```

This comprehensive guide covers all the major concepts from React.js, Spring Boot, Hibernate & JPA, and MySQL used in your SuperKart project. Each section includes practical examples from your actual codebase and demonstrates enterprise-level implementation patterns.
