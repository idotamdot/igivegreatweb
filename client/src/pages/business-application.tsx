import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Building, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ExternalLink,
  Sparkles
} from "lucide-react";

const businessSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  address: z.string().min(10, "Please provide a complete address"),
  keywords: z.string().min(10, "Please provide relevant keywords"),
  ethicalValues: z.array(z.string()).min(1, "Please select at least one ethical value"),
  
  // Compliance declarations
  legalCompliance: z.boolean().refine(val => val === true, "You must confirm legal compliance"),
  noIllegalProducts: z.boolean().refine(val => val === true, "You must confirm no illegal products/services"),
  noAdultContent: z.boolean().refine(val => val === true, "You must confirm no adult/sex industry content"),
  noDrugs: z.boolean().refine(val => val === true, "You must confirm no drug-related content"),
  noMarketingAgencies: z.boolean().refine(val => val === true, "You must confirm not a marketing agency"),
  noDataSelling: z.boolean().refine(val => val === true, "You must confirm no data selling"),
  websiteSafety: z.boolean().refine(val => val === true, "You must confirm website safety compliance"),
  accessibility: z.boolean().refine(val => val === true, "You must confirm accessibility compliance"),
  
  needsWebServices: z.boolean().default(false),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessApplication() {
  const { toast } = useToast();
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [complianceWarnings, setComplianceWarnings] = useState<string[]>([]);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessName: "",
      description: "",
      category: "",
      website: "",
      email: "",
      phone: "",
      address: "",
      keywords: "",
      ethicalValues: [],
      legalCompliance: false,
      noIllegalProducts: false,
      noAdultContent: false,
      noDrugs: false,
      noMarketingAgencies: false,
      noDataSelling: false,
      websiteSafety: false,
      accessibility: false,
      needsWebServices: false,
    }
  });

  const categories = [
    "Healing & Wellness",
    "Creative Tools & Services",
    "Sustainable Living",
    "Learning & Growth",
    "Community & Connection",
    "Food & Nutrition",
    "Technology & Software",
    "Professional Services",
    "Arts & Crafts",
    "Home & Garden",
    "Personal Care",
    "Financial Services",
    "Transportation",
    "Real Estate",
    "Consulting",
    "Other"
  ];

  const ethicalValues = [
    "Fair Trade",
    "Handmade",
    "Organic",
    "Biodegradable",
    "Transparent Business",
    "No Behavioral Ads",
    "Community Supported",
    "Local Business",
    "Woman-Owned",
    "Minority-Owned",
    "B-Corp Certified",
    "Carbon Neutral",
    "Cruelty-Free",
    "Open Source",
    "Privacy-First"
  ];

  const generateKeywordSuggestions = (businessName: string, description: string, category: string) => {
    const suggestions = [];
    
    if (businessName) {
      suggestions.push(businessName.toLowerCase());
    }
    
    // Category-based suggestions
    const categoryKeywords = {
      "Healing & Wellness": ["wellness", "healing", "therapy", "health", "holistic", "natural"],
      "Creative Tools & Services": ["creative", "design", "art", "tools", "inspiration", "artistic"],
      "Sustainable Living": ["sustainable", "eco-friendly", "green", "environmental", "organic", "renewable"],
      "Food & Nutrition": ["food", "nutrition", "healthy", "organic", "local", "fresh"],
      "Technology & Software": ["technology", "software", "digital", "app", "platform", "innovation"],
    };
    
    if (category && categoryKeywords[category as keyof typeof categoryKeywords]) {
      suggestions.push(...categoryKeywords[category as keyof typeof categoryKeywords]);
    }
    
    // Extract keywords from description
    if (description) {
      const words = description.toLowerCase().split(/\s+/)
        .filter(word => word.length > 3)
        .filter(word => !['that', 'with', 'this', 'from', 'they', 'have', 'will', 'been', 'your'].includes(word))
        .slice(0, 10);
      suggestions.push(...words);
    }
    
    setSuggestedKeywords(Array.from(new Set(suggestions)).slice(0, 15));
  };

  const addKeyword = (keyword: string) => {
    const currentKeywords = form.getValues("keywords");
    const keywordList = currentKeywords ? currentKeywords.split(", ") : [];
    if (!keywordList.includes(keyword)) {
      keywordList.push(keyword);
      form.setValue("keywords", keywordList.join(", "));
    }
  };

  const checkCompliance = (website: string, description: string, businessName: string) => {
    const warnings = [];
    const lowerDescription = description.toLowerCase();
    const lowerName = businessName.toLowerCase();
    const lowerWebsite = website.toLowerCase();
    
    // Check for potential compliance issues
    const adultKeywords = ["adult", "sex", "porn", "escort", "dating", "cam", "webcam"];
    const drugKeywords = ["cannabis", "marijuana", "cbd", "thc", "dispensary", "vape"];
    const marketingKeywords = ["marketing agency", "seo agency", "digital marketing", "affiliate marketing"];
    const dataKeywords = ["data broker", "data selling", "lead generation", "email lists"];
    
    if (adultKeywords.some(keyword => lowerDescription.includes(keyword) || lowerName.includes(keyword))) {
      warnings.push("Potential adult content detected - please review our content policy");
    }
    
    if (drugKeywords.some(keyword => lowerDescription.includes(keyword) || lowerName.includes(keyword))) {
      warnings.push("Cannabis/drug-related content detected - ensure full legal compliance documentation");
    }
    
    if (marketingKeywords.some(keyword => lowerDescription.includes(keyword) || lowerName.includes(keyword))) {
      warnings.push("Marketing agency detected - we do not list marketing agencies");
    }
    
    if (dataKeywords.some(keyword => lowerDescription.includes(keyword) || lowerName.includes(keyword))) {
      warnings.push("Data selling/brokerage detected - we do not list data exploitation businesses");
    }
    
    setComplianceWarnings(warnings);
  };

  const submitMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      return await apiRequest("POST", "/api/business-applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted!",
        description: "Thank you for your application. We'll review it within 48 hours and contact you via email.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: BusinessFormData) => {
    if (complianceWarnings.length > 0) {
      toast({
        title: "Compliance Issues Detected",
        description: "Please review and address the compliance warnings before submitting.",
        variant: "destructive",
      });
      return;
    }
    submitMutation.mutate(data);
  };

  const watchedValues = form.watch();

  // Auto-generate keywords when business info changes
  useState(() => {
    if (watchedValues.businessName || watchedValues.description || watchedValues.category) {
      generateKeywordSuggestions(watchedValues.businessName, watchedValues.description, watchedValues.category);
    }
  });

  // Auto-check compliance
  useState(() => {
    if (watchedValues.website || watchedValues.description || watchedValues.businessName) {
      checkCompliance(watchedValues.website || "", watchedValues.description, watchedValues.businessName);
    }
  });

  return (
    <div className="min-h-screen bg-cyber-gradient cyber-grid">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Cyberpunk Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/" className="text-cyber-green hover:text-neon-pink transition-colors neon-glow">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-hologram glitch-effect terminal-text">NEURAL_ENTITY_UPLOAD</h1>
              <p className="text-cyber-green terminal-text">&gt;&gt; Join the ethical network collective</p>
            </div>
          </div>
        </header>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Neural Entity Information */}
            <Card className="card-cyber">
              <CardHeader>
                <CardTitle className="text-neon-pink flex items-center gap-2 terminal-text">
                  <Building className="w-5 h-5" />
                  ENTITY_DATA_INPUT
                </CardTitle>
                <CardDescription className="text-cyber-green terminal-text">
                  &gt;&gt; Upload neural entity parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Business Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what your business does, your mission, and what makes you unique..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Minimum 50 characters. This will help customers understand your business.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your business category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-summer">
              <CardHeader>
                <CardTitle className="text-summer flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-website.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        If you have a website, we'll display it as a clickable link
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" type="email" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll use this to contact you about your application
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormDescription>
                        Optional - will be displayed if you want to share it
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Street address, city, state, zip code..."
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        For location-based searches and local customers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Keywords and Values */}
            <Card className="card-winter">
              <CardHeader>
                <CardTitle className="text-winter flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Keywords & Values
                </CardTitle>
                <CardDescription>Help customers find you and understand your values</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter keywords separated by commas (e.g., organic, local, handmade, sustainable...)"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Keywords help customers find your business when searching
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Keyword Suggestions */}
                {suggestedKeywords.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Suggested Keywords:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedKeywords.map(keyword => (
                        <Button
                          key={keyword}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => addKeyword(keyword)}
                          className="text-xs"
                        >
                          {keyword}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="ethicalValues"
                  render={() => (
                    <FormItem>
                      <FormLabel>Ethical Values</FormLabel>
                      <FormDescription>
                        Select values that align with your business (select at least one)
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                        {ethicalValues.map(value => (
                          <FormField
                            key={value}
                            control={form.control}
                            name="ethicalValues"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, value])
                                        : field.onChange(field.value?.filter((val) => val !== value))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {value}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Compliance Warnings */}
            {complianceWarnings.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Compliance Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {complianceWarnings.map((warning, index) => (
                      <li key={index} className="text-red-700 text-sm flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Compliance Declarations */}
            <Card className="bg-winter-gradient text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Compliance Declarations
                </CardTitle>
                <CardDescription className="text-white/90">
                  Please confirm your business meets our standards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="legalCompliance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My business operates within all applicable laws and regulations *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noIllegalProducts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          I do not sell illegal products or services *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noAdultContent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My business is not related to adult content, pornography, or the sex industry *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noDrugs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My business is not related to drugs or controlled substances *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noMarketingAgencies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My business is not a marketing agency, affiliate marketing site, or website service *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noDataSelling"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My business does not buy, sell, or exploit personal data for commercial purposes *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSafety"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My website (if applicable) is safe and meets legal safety standards *
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accessibility"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-white">
                          My website (if applicable) meets accessibility compliance requirements *
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Web Services Offer */}
            <Card className="card-spring">
              <CardHeader>
                <CardTitle className="text-spring flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Need Professional Web Services?
                </CardTitle>
                <CardDescription>
                  We offer professional website development and digital services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="needsWebServices"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>
                        I'm interested in learning about your web development services
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4">
                  <Link to="/services">
                    <Button variant="outline" type="button">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Our Services
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                size="lg"
                disabled={submitMutation.isPending || complianceWarnings.length > 0}
                className="bg-spring-gradient hover:bg-summer-gradient px-8 py-4 text-lg"
              >
                {submitMutation.isPending ? (
                  "Submitting Application..."
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}