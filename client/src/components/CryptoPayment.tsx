import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bitcoin, Coins, Copy, Check, Clock, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CryptoPaymentProps {
  amount: number;
  serviceType: string;
  clientEmail: string;
  onPaymentComplete?: (paymentId: string) => void;
}

interface PaymentDetails {
  success: boolean;
  walletAddress?: string;
  paymentId: string;
  qrCode?: string;
  amount: number;
  currency: string;
  expiresAt: Date;
}

interface ExchangeRates {
  BTC: number;
  ETH: number;
  USDC: number;
  USDT: number;
}

export default function CryptoPayment({ amount, serviceType, clientEmail, onPaymentComplete }: CryptoPaymentProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<'BTC' | 'ETH' | 'USDC' | 'USDT'>('BTC');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'confirmed' | 'expired'>('pending');
  const [copied, setCopied] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    if (paymentDetails && paymentStatus === 'pending') {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const expiryTime = new Date(paymentDetails.expiresAt).getTime();
        const difference = expiryTime - now;

        if (difference > 0) {
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setPaymentStatus('expired');
          setTimeRemaining('Expired');
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentDetails, paymentStatus]);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch('/api/crypto/exchange-rates');
      if (response.ok) {
        const rates = await response.json();
        setExchangeRates(rates);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
    }
  };

  const createPayment = async () => {
    setIsCreatingPayment(true);
    try {
      const response = await fetch('/api/crypto/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: selectedCurrency,
          clientEmail,
          serviceType
        })
      });

      if (response.ok) {
        const details = await response.json();
        setPaymentDetails(details);
        setPaymentStatus('pending');
        toast({
          title: "Payment Address Created",
          description: `Send ${getCryptoAmount()} ${selectedCurrency} to the address below`,
        });
      } else {
        throw new Error('Failed to create payment address');
      }
    } catch (error) {
      toast({
        title: "Payment Creation Failed",
        description: "Unable to create crypto payment address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const verifyPayment = async () => {
    if (!paymentDetails) return;
    
    setIsVerifying(true);
    setPaymentStatus('verifying');

    try {
      const response = await fetch('/api/crypto/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: paymentDetails.paymentId,
          walletAddress: paymentDetails.walletAddress
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.verified) {
          setPaymentStatus('confirmed');
          toast({
            title: "Payment Confirmed!",
            description: "Your crypto payment has been verified and processed.",
          });
          onPaymentComplete?.(paymentDetails.paymentId);
        } else {
          setPaymentStatus('pending');
          toast({
            title: "Payment Not Found",
            description: "Transaction not yet confirmed. Please wait and try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      setPaymentStatus('pending');
      toast({
        title: "Verification Failed",
        description: "Unable to verify payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy address. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const getCryptoAmount = () => {
    if (!exchangeRates) return '0';
    
    switch (selectedCurrency) {
      case 'BTC':
        return (amount / exchangeRates.BTC).toFixed(8);
      case 'ETH':
        return (amount / exchangeRates.ETH).toFixed(6);
      case 'USDC':
      case 'USDT':
        return amount.toFixed(2);
      default:
        return '0';
    }
  };

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return <Bitcoin className="w-5 h-5 text-orange-500" />;
      case 'ETH':
        return <Coins className="w-5 h-5 text-blue-500" />;
      case 'USDC':
      case 'USDT':
        return <Coins className="w-5 h-5 text-green-500" />;
      default:
        return <Coins className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'pending':
        return 'text-yellow-500';
      case 'verifying':
        return 'text-blue-500';
      case 'confirmed':
        return 'text-green-500';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-cyan-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-400">
            <Shield className="w-5 h-5" />
            Crypto Payment Portal
          </CardTitle>
          <CardDescription className="text-gray-300">
            Secure cryptocurrency payment for {serviceType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Summary */}
          <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
            <div>
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-2xl font-bold text-white">${amount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Service</p>
              <p className="text-lg font-semibold text-cyan-400">{serviceType}</p>
            </div>
          </div>

          {!paymentDetails ? (
            <div className="space-y-4">
              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-gray-300">Select Cryptocurrency</Label>
                <Select value={selectedCurrency} onValueChange={(value: any) => setSelectedCurrency(value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Choose currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="BTC" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-4 h-4 text-orange-500" />
                        Bitcoin (BTC)
                      </div>
                    </SelectItem>
                    <SelectItem value="ETH" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-blue-500" />
                        Ethereum (ETH)
                      </div>
                    </SelectItem>
                    <SelectItem value="USDC" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-green-500" />
                        USD Coin (USDC)
                      </div>
                    </SelectItem>
                    <SelectItem value="USDT" className="text-white hover:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <Coins className="w-4 h-4 text-green-500" />
                        Tether (USDT)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exchange Rate Display */}
              {exchangeRates && (
                <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">You will pay:</span>
                    <div className="flex items-center gap-2">
                      {getCurrencyIcon(selectedCurrency)}
                      <span className="text-lg font-bold text-white">
                        {getCryptoAmount()} {selectedCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                onClick={createPayment} 
                disabled={isCreatingPayment}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
              >
                {isCreatingPayment ? (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-pulse" />
                    Creating Payment Address...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Generate Payment Address
                  </div>
                )}
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Payment Status */}
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400">Status:</span>
                    <Badge variant="outline" className={`${getStatusColor()} border-current`}>
                      {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
                    </Badge>
                  </div>
                  {timeRemaining && paymentStatus === 'pending' && (
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Time remaining</p>
                      <p className="text-lg font-mono text-yellow-400">{timeRemaining}</p>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-300">Send exactly this amount:</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-600">
                      {getCurrencyIcon(selectedCurrency)}
                      <span className="text-xl font-bold text-white">
                        {getCryptoAmount()} {selectedCurrency}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">To this wallet address:</Label>
                    <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-lg border border-gray-600">
                      <Input 
                        value={paymentDetails.walletAddress || ''} 
                        readOnly 
                        className="bg-transparent border-none text-white font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(paymentDetails.walletAddress || '')}
                        className="shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={verifyPayment}
                    disabled={isVerifying || paymentStatus === 'confirmed' || paymentStatus === 'expired'}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isVerifying ? 'Checking...' : 'Verify Payment'}
                  </Button>
                  
                  {paymentStatus === 'expired' && (
                    <Button
                      onClick={() => {
                        setPaymentDetails(null);
                        setPaymentStatus('pending');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Create New Payment
                    </Button>
                  )}
                </div>

                {paymentStatus === 'confirmed' && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Payment Confirmed!</span>
                    </div>
                    <p className="text-sm text-green-300 mt-1">
                      Your Neural Web Labs service will be activated shortly.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </div>
  );
}