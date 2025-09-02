import { useState } from 'react';
import { Plus, Building2, Users, Car, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

interface Apartment {
  apartmentId: string;
  name: string;
  location: string;
  totalFlats: number;
  occupiedFlats: number;
}

interface Flat {
  flatId: string;
  apartmentId: string;
  flatNumber: string;
  ownerName: string;
  isRented: boolean;
  tenantName?: string;
  carOwned: boolean;
  carNumber?: string;
  familyMembersCount: number;
}

export const ApartmentManagement = () => {
  const { toast } = useToast();
  const [apartments, setApartments] = useState<Apartment[]>([
    {
      apartmentId: 'apt-1',
      name: 'Green Valley Heights',
      location: 'Sector 18, Noida',
      totalFlats: 120,
      occupiedFlats: 115
    },
    {
      apartmentId: 'apt-2', 
      name: 'Royal Gardens',
      location: 'Gurgaon',
      totalFlats: 85,
      occupiedFlats: 82
    }
  ]);

  const [flats, setFlats] = useState<Flat[]>([
    {
      flatId: 'flat-1',
      apartmentId: 'apt-1',
      flatNumber: 'A-101',
      ownerName: 'Rajesh Kumar',
      isRented: false,
      carOwned: true,
      carNumber: 'DL-3C-1234',
      familyMembersCount: 4
    },
    {
      flatId: 'flat-2',
      apartmentId: 'apt-1',
      flatNumber: 'A-102',
      ownerName: 'Priya Sharma',
      isRented: true,
      tenantName: 'Amit Singh',
      carOwned: false,
      familyMembersCount: 3
    }
  ]);

  const [selectedApartment, setSelectedApartment] = useState<string | null>(null);
  const [newApartment, setNewApartment] = useState({
    name: '',
    location: '',
    totalFlats: 0
  });
  const [newFlat, setNewFlat] = useState({
    flatNumber: '',
    ownerName: '',
    isRented: false,
    tenantName: '',
    carOwned: false,
    carNumber: '',
    familyMembersCount: 0
  });

  const handleAddApartment = () => {
    if (!newApartment.name || !newApartment.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const apartment: Apartment = {
      apartmentId: `apt-${Date.now()}`,
      ...newApartment,
      occupiedFlats: 0
    };

    setApartments([...apartments, apartment]);
    setNewApartment({ name: '', location: '', totalFlats: 0 });
    toast({
      title: "Success",
      description: "Apartment added successfully!",
    });
  };

  const handleAddFlat = () => {
    if (!selectedApartment || !newFlat.flatNumber || !newFlat.ownerName) {
      toast({
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const flat: Flat = {
      flatId: `flat-${Date.now()}`,
      apartmentId: selectedApartment,
      ...newFlat
    };

    setFlats([...flats, flat]);
    
    // Update occupied flats count
    setApartments(apartments.map(apt => 
      apt.apartmentId === selectedApartment 
        ? { ...apt, occupiedFlats: apt.occupiedFlats + 1 }
        : apt
    ));

    setNewFlat({
      flatNumber: '',
      ownerName: '',
      isRented: false,
      tenantName: '',
      carOwned: false,
      carNumber: '',
      familyMembersCount: 0
    });

    toast({
      title: "Success",
      description: "Flat added successfully!",
    });
  };

  const getApartmentFlats = (apartmentId: string) => {
    return flats.filter(flat => flat.apartmentId === apartmentId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Apartment Management</h2>
          <p className="text-muted-foreground">Manage apartments and flats information</p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" />
                Add Apartment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Apartment</DialogTitle>
                <DialogDescription>Enter the apartment details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apt-name">Apartment Name *</Label>
                  <Input
                    id="apt-name"
                    value={newApartment.name}
                    onChange={(e) => setNewApartment({...newApartment, name: e.target.value})}
                    placeholder="e.g. Green Valley Heights"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-location">Location *</Label>
                  <Input
                    id="apt-location"
                    value={newApartment.location}
                    onChange={(e) => setNewApartment({...newApartment, location: e.target.value})}
                    placeholder="e.g. Sector 18, Noida"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt-flats">Total Flats</Label>
                  <Input
                    id="apt-flats"
                    type="number"
                    value={newApartment.totalFlats}
                    onChange={(e) => setNewApartment({...newApartment, totalFlats: parseInt(e.target.value) || 0})}
                    placeholder="120"
                  />
                </div>
                <Button onClick={handleAddApartment} className="w-full">
                  Add Apartment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {apartments.map((apartment) => (
          <Card 
            key={apartment.apartmentId}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedApartment === apartment.apartmentId ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedApartment(apartment.apartmentId)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="truncate">{apartment.name}</span>
                </span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>{apartment.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Occupied Flats:</span>
                  <span className="font-medium">
                    {apartment.occupiedFlats}/{apartment.totalFlats}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy Rate:</span>
                  <Badge variant={apartment.occupiedFlats / apartment.totalFlats > 0.9 ? "default" : "secondary"}>
                    {Math.round((apartment.occupiedFlats / apartment.totalFlats) * 100)}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedApartment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-secondary" />
                  <span>Flat Details - {apartments.find(a => a.apartmentId === selectedApartment)?.name}</span>
                </CardTitle>
                <CardDescription>Manage individual flat information</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Flat
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Flat</DialogTitle>
                    <DialogDescription>Enter the flat details below</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="flat-number">Flat Number *</Label>
                      <Input
                        id="flat-number"
                        value={newFlat.flatNumber}
                        onChange={(e) => setNewFlat({...newFlat, flatNumber: e.target.value})}
                        placeholder="A-101"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner-name">Owner Name *</Label>
                      <Input
                        id="owner-name"
                        value={newFlat.ownerName}
                        onChange={(e) => setNewFlat({...newFlat, ownerName: e.target.value})}
                        placeholder="Rajesh Kumar"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-rented"
                        checked={newFlat.isRented}
                        onCheckedChange={(checked) => setNewFlat({...newFlat, isRented: checked})}
                      />
                      <Label htmlFor="is-rented">Is Rented</Label>
                    </div>
                    {newFlat.isRented && (
                      <div className="space-y-2">
                        <Label htmlFor="tenant-name">Tenant Name</Label>
                        <Input
                          id="tenant-name"
                          value={newFlat.tenantName}
                          onChange={(e) => setNewFlat({...newFlat, tenantName: e.target.value})}
                          placeholder="Amit Singh"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="car-owned"
                        checked={newFlat.carOwned}
                        onCheckedChange={(checked) => setNewFlat({...newFlat, carOwned: checked})}
                      />
                      <Label htmlFor="car-owned">Car Owned</Label>
                    </div>
                    {newFlat.carOwned && (
                      <div className="space-y-2">
                        <Label htmlFor="car-number">Car Number</Label>
                        <Input
                          id="car-number"
                          value={newFlat.carNumber}
                          onChange={(e) => setNewFlat({...newFlat, carNumber: e.target.value})}
                          placeholder="DL-3C-1234"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="family-members">Family Members</Label>
                      <Input
                        id="family-members"
                        type="number"
                        value={newFlat.familyMembersCount}
                        onChange={(e) => setNewFlat({...newFlat, familyMembersCount: parseInt(e.target.value) || 0})}
                        placeholder="4"
                      />
                    </div>
                    <Button onClick={handleAddFlat} className="w-full">
                      Add Flat
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Flat #</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getApartmentFlats(selectedApartment).map((flat) => (
                  <TableRow key={flat.flatId}>
                    <TableCell className="font-medium">{flat.flatNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{flat.ownerName}</div>
                        {flat.isRented && flat.tenantName && (
                          <div className="text-sm text-muted-foreground">
                            Tenant: {flat.tenantName}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={flat.isRented ? "secondary" : "default"}>
                        {flat.isRented ? "Rented" : "Owner"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {flat.carOwned ? (
                        <div className="flex items-center space-x-1">
                          <Car className="w-4 h-4 text-primary" />
                          <span className="text-sm">{flat.carNumber}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell>{flat.familyMembersCount}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};