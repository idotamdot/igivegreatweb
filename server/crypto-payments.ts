import { Coinbase, Wallet } from '@coinbase/coinbase-sdk';
import Web3 from 'web3';
import { ethers } from 'ethers';

// Crypto payment configuration
export interface CryptoPaymentRequest {
  amount: number;
  currency: 'BTC' | 'ETH' | 'USDC' | 'USDT';
  clientEmail: string;
  projectId?: number;
  serviceType: string;
}

export interface CryptoPaymentResult {
  success: boolean;
  walletAddress?: string;
  paymentId: string;
  qrCode?: string;
  amount: number;
  currency: string;
  expiresAt: Date;
}

class CryptoPaymentService {
  private coinbase: Coinbase | null = null;
  private web3: Web3;
  
  constructor() {
    // Initialize Web3 for Ethereum transactions
    this.web3 = new Web3();
    
    // Initialize Coinbase SDK if API key is available
    if (process.env.COINBASE_API_KEY && process.env.COINBASE_SECRET) {
      this.coinbase = new Coinbase({
        apiKeyName: process.env.COINBASE_API_KEY,
        privateKey: process.env.COINBASE_SECRET
      });
    }
  }

  async createPaymentAddress(request: CryptoPaymentRequest): Promise<CryptoPaymentResult> {
    const paymentId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      switch (request.currency) {
        case 'BTC':
          return await this.createBitcoinPayment(request, paymentId);
        case 'ETH':
        case 'USDC':
        case 'USDT':
          return await this.createEthereumPayment(request, paymentId);
        default:
          throw new Error(`Unsupported cryptocurrency: ${request.currency}`);
      }
    } catch (error) {
      console.error('Crypto payment creation failed:', error);
      return {
        success: false,
        paymentId,
        amount: request.amount,
        currency: request.currency,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      };
    }
  }

  private async createBitcoinPayment(request: CryptoPaymentRequest, paymentId: string): Promise<CryptoPaymentResult> {
    if (!this.coinbase) {
      // Generate a demo Bitcoin address for development
      const demoAddress = this.generateDemoBitcoinAddress();
      return {
        success: true,
        walletAddress: demoAddress,
        paymentId,
        amount: request.amount,
        currency: 'BTC',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        qrCode: `bitcoin:${demoAddress}?amount=${this.convertToBTC(request.amount)}`
      };
    }

    // Production Bitcoin payment with Coinbase
    const wallet = await this.coinbase.createWallet();
    const address = await wallet.createAddress();
    
    return {
      success: true,
      walletAddress: address.getId(),
      paymentId,
      amount: request.amount,
      currency: 'BTC',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      qrCode: `bitcoin:${address.getId()}?amount=${this.convertToBTC(request.amount)}`
    };
  }

  private async createEthereumPayment(request: CryptoPaymentRequest, paymentId: string): Promise<CryptoPaymentResult> {
    // Generate Ethereum wallet for payment
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    
    const amount = request.currency === 'ETH' 
      ? this.convertToETH(request.amount)
      : request.amount; // USDC/USDT already in proper units

    return {
      success: true,
      walletAddress: address,
      paymentId,
      amount: request.amount,
      currency: request.currency,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      qrCode: `ethereum:${address}?value=${amount}`
    };
  }

  private generateDemoBitcoinAddress(): string {
    // Generate a valid Bitcoin testnet address format for demo
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = 'tb1q'; // Testnet bech32 prefix
    for (let i = 0; i < 39; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private convertToBTC(usdAmount: number): number {
    // Simplified BTC conversion (in production, use real-time rates)
    const btcPrice = 45000; // Demo price
    return Number((usdAmount / btcPrice).toFixed(8));
  }

  private convertToETH(usdAmount: number): string {
    // Simplified ETH conversion (in production, use real-time rates)
    const ethPrice = 2500; // Demo price
    const ethAmount = usdAmount / ethPrice;
    return ethers.parseEther(ethAmount.toString()).toString();
  }

  async verifyPayment(paymentId: string, walletAddress: string): Promise<boolean> {
    // In production, implement blockchain verification
    // For demo, simulate successful payment after delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.3); // 70% success rate for demo
      }, 2000);
    });
  }

  async getExchangeRates(): Promise<Record<string, number>> {
    // In production, fetch from CoinGecko or similar API
    return {
      BTC: 45000,
      ETH: 2500,
      USDC: 1.00,
      USDT: 1.00
    };
  }
}

export const cryptoPaymentService = new CryptoPaymentService();