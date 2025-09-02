import { useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface ImportResult {
  fileName: string;
  rowsProcessed: number;
  rowsSucceeded: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}

export const CSVManager = () => {
  const { toast } = useToast();
  const [importResults, setImportResults] = useState<ImportResult[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // CSV Templates
  const csvTemplates = {
    apartments: `Apartment Name,Location,Total Flats
Green Valley Heights,Sector 18 Noida,120
Royal Gardens,Gurgaon,85
Sunshine Apartments,Delhi,95`,

    flats: `Apartment Name,Flat Number,Owner Name,Is Rented (Yes/No),Tenant Name,Car Owned (Yes/No),Car Number,Family Members
Green Valley Heights,A-101,Rajesh Kumar,No,,Yes,DL-3C-1234,4
Green Valley Heights,A-102,Priya Sharma,Yes,Amit Singh,No,,3
Royal Gardens,B-201,Ravi Gupta,No,,Yes,DL-8C-5678,5`,

    transactions: `Apartment Name,Flat Number (optional),Date (DD/MM/YYYY),Type (maintenance_receipt/other_receipt/expense),Category,Amount,Mode,Narration
Green Valley Heights,A-101,15/01/2025,maintenance_receipt,maintenance,5000,upi,Monthly maintenance January 2025
Green Valley Heights,,12/01/2025,expense,electricity,8500,bank,Electricity bill January 2025  
Royal Gardens,B-201,10/01/2025,maintenance_receipt,maintenance,4500,cash,Maintenance payment for January`
  };

  const downloadTemplate = (templateType: keyof typeof csvTemplates) => {
    const csvContent = csvTemplates[templateType];
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: `${templateType} template has been downloaded successfully.`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(files);
    }
  };

  const processCSVImport = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "Error",
        description: "Please select CSV files to import",
        variant: "destructive"
      });
      return;
    }

    const results: ImportResult[] = [];

    // Mock processing for each file
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      
      // Simulate processing with some mock results
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async processing

      const mockResult: ImportResult = {
        fileName,
        rowsProcessed: Math.floor(Math.random() * 50) + 10,
        rowsSucceeded: 0,
        errors: []
      };

      // Simulate some errors for demonstration
      if (fileName.toLowerCase().includes('error') || Math.random() < 0.3) {
        mockResult.errors = [
          { row: 3, message: "Invalid date format. Expected DD/MM/YYYY" },
          { row: 7, message: "Amount field is empty or invalid" }
        ];
        mockResult.rowsSucceeded = mockResult.rowsProcessed - mockResult.errors.length;
      } else {
        mockResult.rowsSucceeded = mockResult.rowsProcessed;
      }

      results.push(mockResult);
    }

    setImportResults(results);
    
    const totalSucceeded = results.reduce((sum, result) => sum + result.rowsSucceeded, 0);
    const totalErrors = results.reduce((sum, result) => sum + result.errors.length, 0);

    if (totalErrors === 0) {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${totalSucceeded} records.`,
      });
    } else {
      toast({
        title: "Import Completed with Errors", 
        description: `${totalSucceeded} records imported, ${totalErrors} errors found.`,
        variant: "destructive"
      });
    }
  };

  const exportData = (dataType: string) => {
    // Mock export functionality
    let csvContent = '';
    let filename = '';

    switch (dataType) {
      case 'apartments':
        csvContent = csvTemplates.apartments;
        filename = 'apartments_export.csv';
        break;
      case 'flats':
        csvContent = csvTemplates.flats;
        filename = 'flats_export.csv';
        break;
      case 'transactions':
        csvContent = csvTemplates.transactions;
        filename = 'transactions_export.csv';
        break;
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${dataType} data has been exported successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">CSV Import/Export</h2>
        <p className="text-muted-foreground">Manage bulk data operations using CSV files</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Templates */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-primary" />
              <span>Download Templates</span>
            </CardTitle>
            <CardDescription>Get blank CSV templates with proper headers and sample data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Apartments Template</div>
                  <div className="text-sm text-muted-foreground">Apartment master data with locations</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadTemplate('apartments')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Flats Template</div>
                  <div className="text-sm text-muted-foreground">Flat details with owner/tenant information</div>
                </div>  
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadTemplate('flats')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Transactions Template</div>
                  <div className="text-sm text-muted-foreground">Transaction records with receipts and expenses</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadTemplate('transactions')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                Templates include sample data and proper formatting. Use these as reference for your CSV files.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* CSV Import */}
        <Card className="border-l-4 border-l-secondary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-secondary" />
              <span>Import CSV Data</span>
            </CardTitle>
            <CardDescription>Upload CSV files to import apartments, flats, and transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-files">Select CSV Files</Label>
              <Input
                id="csv-files"
                type="file"
                accept=".csv"
                multiple
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                You can select multiple CSV files at once
              </p>
            </div>

            {selectedFiles && selectedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files:</Label>
                <div className="space-y-1">
                  {Array.from(selectedFiles).map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                      <span className="font-medium">{file.name}</span>
                      <Badge variant="outline">{(file.size / 1024).toFixed(1)} KB</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={processCSVImport} 
              className="w-full"
              disabled={!selectedFiles || selectedFiles.length === 0}
              variant="secondary"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV Files
            </Button>

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                CSV files will be validated before import. Any errors will be shown in the results below.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-primary" />
            <span>Export Current Data</span>
          </CardTitle>
          <CardDescription>Download current apartment, flat, and transaction data as CSV</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => exportData('apartments')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <FileText className="w-6 h-6" />
              <span className="font-medium">Export Apartments</span>
              <span className="text-xs text-muted-foreground text-center">Download all apartment data</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => exportData('flats')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <FileText className="w-6 h-6" />
              <span className="font-medium">Export Flats</span>
              <span className="text-xs text-muted-foreground text-center">Download all flat data</span>
            </Button>

            <Button 
              variant="outline" 
              onClick={() => exportData('transactions')}
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <FileText className="w-6 h-6" />
              <span className="font-medium">Export Transactions</span>
              <span className="text-xs text-muted-foreground text-center">Download all transaction data</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Import Results */}
      {importResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span>Import Results</span>
            </CardTitle>
            <CardDescription>Results from the latest CSV import operation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{result.fileName}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Badge variant="default">
                        {result.rowsSucceeded} Success
                      </Badge>
                      {result.errors.length > 0 && (
                        <Badge variant="destructive">
                          {result.errors.length} Errors
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Processed:</span>
                      <span className="ml-2 font-medium">{result.rowsProcessed}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Succeeded:</span>
                      <span className="ml-2 font-medium text-success">{result.rowsSucceeded}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors:</span>
                      <span className="ml-2 font-medium text-destructive">{result.errors.length}</span>
                    </div>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-destructive">Errors:</Label>
                      <div className="space-y-1">
                        {result.errors.map((error, errorIndex) => (
                          <div key={errorIndex} className="flex items-start space-x-2 p-2 bg-destructive/10 rounded text-sm">
                            <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-medium">Row {error.row}:</span>
                              <span className="ml-1">{error.message}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setImportResults([])}
              className="mt-4"
            >
              Clear Results
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};