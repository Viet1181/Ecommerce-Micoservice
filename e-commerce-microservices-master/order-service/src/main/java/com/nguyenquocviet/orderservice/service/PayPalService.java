package com.nguyenquocviet.orderservice.service;

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PayPalService {

    @Autowired
    private APIContext apiContext;

    public Payment createPayment(
            BigDecimal total, 
            String currency, 
            String method,
            String intent,
            String description, 
            String cancelUrl, 
            String successUrl) throws PayPalRESTException {
        
        // Kiểm tra số tiền
        if (total == null || total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Số tiền thanh toán không hợp lệ");
        }

        // Chuyển đổi VND sang USD nếu cần
        if ("VND".equalsIgnoreCase(currency)) {
            total = total.divide(new BigDecimal(23000), 2, RoundingMode.HALF_UP);
            currency = "USD";
        }

        Amount amount = new Amount();
        amount.setCurrency(currency);
        total = total.setScale(2, RoundingMode.HALF_UP);
        amount.setTotal(total.toString());

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        Payment payment = new Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);

        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);
        
        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);
        
        return payment.execute(apiContext, paymentExecution);
    }
}
