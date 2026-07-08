
import { Modal, Button } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
    return (
        <div className="checkoutPopup">
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="checkout-items">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="checkout-item"
                                    style={{ display: "flex", marginBottom: "10px" }}
                                >
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/150"}
                                        alt={item.name || "Product"}
                                        className="cart-item-image"
                                        style={{ width: "150px", marginRight: "10px", borderRadius: "6px" }}
                                    />
                                    <div>
                                        <b>
                                            <p style={{ marginBottom: "5px" }}>{item.name}</p>
                                        </b>
                                        <p style={{ marginBottom: "5px" }}>Quantity: {item.quantity}</p>
                                        <p style={{ marginBottom: "5px" }}>
                                            Price: ${item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted">No items in cart</p>
                        )}

                        <div>
                            <h5
                                style={{
                                    color: "black",
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "1.3rem",
                                    fontWeight: "bold",
                                    marginTop: "15px",
                                }}
                            >
                                Total: ${totalPrice}
                            </h5>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleCheckout}
                        disabled={cartItems.length === 0}
                    >
                        Confirm Purchase
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CheckoutPopup;