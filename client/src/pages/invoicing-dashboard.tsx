import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Building2, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  Eye
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface Enterprise {
  id: number;
  name: string;
  email: string;
  contact_person: string;
  phone?: string;
  address: string;
  tax_id?: string;
  industry?: string;
  company_size: string;
  billing_cycle: string;
  payment_terms: number;
  discount_rate: number;
  status: string;
  total_invoices: number;
  total_paid: number;
  total_overdue: number;
  created_at: string;
}

interface Invoice {
  id: number;
  invoice_number: string;
  enterprise_id: number;
  enterprise_name: string;
  contact_person: string;
  issue_date: string;
  due_date: string;
  amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  payment_date?: string;
  description: string;
  created_at: string;
}

interface InvoiceStats {
  total_invoices: number;
  total_paid: number;
  total_overdue: number;
  total_pending: number;
  total_draft: number;
  average_invoice_amount: number;
}

export default function InvoicingDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'enterprises'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch invoice statistics
  const { data: stats, isLoading: statsLoading } = useQuery<InvoiceStats>({
    queryKey: ['/api/invoices/stats'],
  });

  // Fetch invoices
  const { data: invoices = [], isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ['/api/invoices'],
  });

  // Fetch enterprises
  const { data: enterprises = [], isLoading: enterprisesLoading } = useQuery<Enterprise[]>({
    queryKey: ['/api/enterprises'],
  });

  // Filter invoices based on search and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.enterprise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Update invoice status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ invoiceId, status, paymentData }: { 
      invoiceId: number; 
      status: string; 
      paymentData?: any 
    }) => {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentData }),
      });
      if (!response.ok) throw new Error('Failed to update invoice status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices/stats'] });
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      viewed: 'bg-purple-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-700'
    };
    
    return (
      <Badge className={`${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500'} text-white neon-glow`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (statsLoading || invoicesLoading || enterprisesLoading) {
    return (
      <div className="min-h-screen bg-cyber-gradient cyber-grid flex items-center justify-center">
        <div className="text-cyber-green terminal-text text-xl">
          LOADING_INVOICING_SYSTEM...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-cyber-green terminal-text neon-glow">
              ENTERPRISE_INVOICING
            </h1>
            <p className="text-gray-300 terminal-text mt-2">
              Neural Web Labs - Large Contract Management System
            </p>
          </div>
          <Button 
            className="bg-neon-gradient neon-glow terminal-text"
            onClick={() => navigate('/create-invoice')}
          >
            <Plus className="w-4 h-4 mr-2" />
            CREATE_INVOICE
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4">
          {[
            { id: 'overview', label: 'OVERVIEW', icon: DollarSign },
            { id: 'invoices', label: 'INVOICES', icon: FileText },
            { id: 'enterprises', label: 'ENTERPRISES', icon: Building2 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id as any)}
                className={`cyber-glass border-cyber-green/30 hover:bg-cyber-green/20 ${
                  activeTab === tab.id 
                    ? 'bg-cyber-green text-black neon-glow' 
                    : 'text-cyber-green'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="terminal-text">{tab.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-cyber">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 terminal-text">
                    TOTAL_INVOICES
                  </CardTitle>
                  <FileText className="h-4 w-4 text-cyber-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyber-green terminal-text">
                    {stats?.total_invoices || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-cyber">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 terminal-text">
                    TOTAL_PAID
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500 terminal-text">
                    {formatCurrency(stats?.total_paid || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-cyber">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 terminal-text">
                    TOTAL_OVERDUE
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500 terminal-text">
                    {formatCurrency(stats?.total_overdue || 0)}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-cyber">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300 terminal-text">
                    AVG_INVOICE
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-neon-pink" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-neon-pink terminal-text">
                    {formatCurrency(stats?.average_invoice_amount || 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Invoices */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  RECENT_INVOICES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 cyber-glass rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-cyber-green terminal-text font-medium">
                          {invoice.invoice_number}
                        </div>
                        <div className="text-gray-300 terminal-text">
                          {invoice.enterprise_name}
                        </div>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-neon-pink terminal-text">
                          {formatCurrency(invoice.total_amount)}
                        </div>
                        <div className="text-xs text-gray-400 terminal-text">
                          Due: {formatDate(invoice.due_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card className="card-cyber">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search invoices or enterprises..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 cyber-glass border-cyber-green/30 text-cyber-green"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 cyber-glass border-cyber-green/30 text-cyber-green terminal-text rounded-md"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="viewed">Viewed</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-4">
              {filteredInvoices.map(invoice => (
                <Card key={invoice.id} className="card-cyber hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-lg font-bold text-cyber-green terminal-text">
                            {invoice.invoice_number}
                          </div>
                          <div className="text-gray-300 terminal-text">
                            {invoice.enterprise_name}
                          </div>
                          <div className="text-sm text-gray-400 terminal-text">
                            Contact: {invoice.contact_person}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-neon-pink terminal-text">
                            {formatCurrency(invoice.total_amount)}
                          </div>
                          <div className="text-sm text-gray-400 terminal-text">
                            Issued: {formatDate(invoice.issue_date)}
                          </div>
                          <div className="text-sm text-gray-400 terminal-text">
                            Due: {formatDate(invoice.due_date)}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-cyber-green text-cyber-green hover:bg-cyber-green/20"
                            onClick={() => navigate(`/invoice/${invoice.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {invoice.status === 'draft' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-500 text-blue-500 hover:bg-blue-500/20"
                              onClick={() => updateStatusMutation.mutate({ 
                                invoiceId: invoice.id, 
                                status: 'sent' 
                              })}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          
                          {(invoice.status === 'sent' || invoice.status === 'viewed') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-green-500 text-green-500 hover:bg-green-500/20"
                              onClick={() => updateStatusMutation.mutate({ 
                                invoiceId: invoice.id, 
                                status: 'paid',
                                paymentData: {
                                  payment_method: 'wire',
                                  payment_date: new Date().toISOString(),
                                  payment_reference: `PAY-${invoice.invoice_number}`
                                }
                              })}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Enterprises Tab */}
        {activeTab === 'enterprises' && (
          <div className="space-y-6">
            <Button 
              className="bg-neon-gradient neon-glow terminal-text"
              onClick={() => navigate('/create-enterprise')}
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD_ENTERPRISE
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enterprises.map(enterprise => (
                <Card key={enterprise.id} className="card-cyber hover-lift">
                  <CardHeader>
                    <CardTitle className="text-cyber-green terminal-text flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      {enterprise.name}
                    </CardTitle>
                    <div className="space-y-1">
                      <Badge className={`${enterprise.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {enterprise.status.toUpperCase()}
                      </Badge>
                      <Badge className="bg-blue-500 text-white">
                        {enterprise.company_size.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="terminal-text text-sm text-gray-300">
                      <div>Contact: {enterprise.contact_person}</div>
                      <div>Email: {enterprise.email}</div>
                      <div>Industry: {enterprise.industry || 'Not specified'}</div>
                      <div>Billing: {enterprise.billing_cycle}</div>
                      <div>Terms: {enterprise.payment_terms} days</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center terminal-text text-xs">
                      <div>
                        <div className="text-cyan-400">{enterprise.total_invoices}</div>
                        <div className="text-gray-400">INVOICES</div>
                      </div>
                      <div>
                        <div className="text-green-400">{formatCurrency(enterprise.total_paid)}</div>
                        <div className="text-gray-400">PAID</div>
                      </div>
                      <div>
                        <div className="text-red-400">{formatCurrency(enterprise.total_overdue)}</div>
                        <div className="text-gray-400">OVERDUE</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}