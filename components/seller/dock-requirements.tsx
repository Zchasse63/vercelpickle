"use client"

import { useState } from "react"
import { Warehouse, Truck, Building, ArrowUpDown, CheckCircle2, AlertCircle, Info, Plus, Edit, Trash2 } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Switch,
  Badge,
} from "@/components/ui-kit"
import { useForm } from "react-hook-form"

// Mock data for loading dock facilities
const mockFacilities = [
  {
    id: "facility-1",
    name: "Warehouse A",
    address: "123 Distribution Way, Portland, OR 97230",
    dockType: "standard",
    dockHeight: 48,
    dockCount: 6,
    liftGateAvailable: true,
    forkliftAvailable: true,
    palletJackAvailable: true,
    refrigeration: true,
    maxTruckLength: 53,
    specialInstructions: "Enter through north gate. Check in at security booth.",
    operatingHours: "Monday-Friday, 7:00 AM - 6:00 PM",
    appointmentRequired: true,
    active: true,
  },
  {
    id: "facility-2",
    name: "Warehouse B",
    address: "456 Logistics Parkway, Portland, OR 97211",
    dockType: "standard",
    dockHeight: 52,
    dockCount: 4,
    liftGateAvailable: false,
    forkliftAvailable: true,
    palletJackAvailable: true,
    refrigeration: true,
    maxTruckLength: 48,
    specialInstructions: "Loading dock #3 and #4 are refrigerated only.",
    operatingHours: "Monday-Friday, 8:00 AM - 5:00 PM",
    appointmentRequired: true,
    active: true,
  },
  {
    id: "facility-3",
    name: "Distribution Center C",
    address: "789 Commerce Blvd, Beaverton, OR 97005",
    dockType: "flush",
    dockHeight: 50,
    dockCount: 8,
    liftGateAvailable: true,
    forkliftAvailable: true,
    palletJackAvailable: true,
    refrigeration: false,
    maxTruckLength: 53,
    specialInstructions: "Driver's license required for entry. No overnight parking.",
    operatingHours: "Monday-Saturday, 6:00 AM - 8:00 PM",
    appointmentRequired: false,
    active: true,
  },
]

export function DockRequirements() {
  const [facilities, setFacilities] = useState(mockFacilities)
  const [activeTab, setActiveTab] = useState("facilities")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<typeof mockFacilities[0] | null>(null)
  
  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      dockType: "standard",
      dockHeight: 48,
      dockCount: 1,
      liftGateAvailable: false,
      forkliftAvailable: true,
      palletJackAvailable: true,
      refrigeration: false,
      maxTruckLength: 53,
      specialInstructions: "",
      operatingHours: "Monday-Friday, 8:00 AM - 5:00 PM",
      appointmentRequired: true,
      active: true,
    },
  })
  
  const onSubmit = (data: any) => {
    if (editingFacility) {
      // Update existing facility
      setFacilities(facilities.map(facility => 
        facility.id === editingFacility.id ? { ...facility, ...data } : facility
      ))
    } else {
      // Create new facility
      const newFacility = {
        id: `facility-${facilities.length + 1}`,
        ...data,
      }
      setFacilities([...facilities, newFacility])
    }
    
    setIsCreateDialogOpen(false)
    setEditingFacility(null)
    form.reset()
  }
  
  const handleEdit = (facility: typeof mockFacilities[0]) => {
    setEditingFacility(facility)
    form.reset(facility)
    setIsCreateDialogOpen(true)
  }
  
  const handleDelete = (facilityId: string) => {
    setFacilities(facilities.filter(facility => facility.id !== facilityId))
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Loading Dock Requirements</h2>
          <p className="text-muted-foreground">
            Manage your facilities and loading dock specifications
          </p>
        </div>
        <Dialog 
          open={isCreateDialogOpen} 
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open)
            if (!open) {
              setEditingFacility(null)
              form.reset()
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingFacility ? "Edit Facility" : "Add New Facility"}</DialogTitle>
              <DialogDescription>
                {editingFacility 
                  ? "Update the loading dock specifications for this facility" 
                  : "Add a new facility with loading dock specifications"}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facility Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Warehouse A" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Full address" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dockType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dock Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dock type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="flush">Flush</SelectItem>
                            <SelectItem value="saw-tooth">Saw-tooth</SelectItem>
                            <SelectItem value="open">Open (No Dock)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dockHeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dock Height (inches)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dockCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Docks</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="maxTruckLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Truck Length (feet)</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select max length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="28">28 ft</SelectItem>
                            <SelectItem value="40">40 ft</SelectItem>
                            <SelectItem value="48">48 ft</SelectItem>
                            <SelectItem value="53">53 ft</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="operatingHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operating Hours</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Mon-Fri, 8:00 AM - 5:00 PM" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="liftGateAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Lift Gate Available</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="forkliftAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Forklift Available</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="palletJackAvailable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Pallet Jack Available</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="refrigeration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Refrigerated Docks</FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="appointmentRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Appointment Required</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specialInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions or requirements for carriers" 
                          {...field} 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false)
                    setEditingFacility(null)
                    form.reset()
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFacility ? "Update Facility" : "Add Facility"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="facilities" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="facilities">Your Facilities</TabsTrigger>
          <TabsTrigger value="requirements">Dock Requirements</TabsTrigger>
          <TabsTrigger value="guidelines">Carrier Guidelines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="facilities" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facility</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Dock Specs</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facilities.length > 0 ? (
                  facilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">
                        {facility.name}
                      </TableCell>
                      <TableCell>{facility.address}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Warehouse className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="capitalize">{facility.dockType} dock, {facility.dockHeight}" height</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>Max truck: {facility.maxTruckLength}', {facility.dockCount} docks</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={facility.forkliftAvailable ? "default" : "outline"} className="mr-1">
                            Forklift
                          </Badge>
                          <Badge variant={facility.liftGateAvailable ? "default" : "outline"} className="mr-1">
                            Lift Gate
                          </Badge>
                          <Badge variant={facility.refrigeration ? "default" : "outline"}>
                            Refrigerated
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{facility.operatingHours}</div>
                          {facility.appointmentRequired && (
                            <Badge variant="secondary">Appointment Required</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(facility)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(facility.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No facilities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="requirements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loading Dock Requirements</CardTitle>
              <CardDescription>
                Detailed specifications for carriers and logistics partners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Dock Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium flex items-center mb-2">
                      <Warehouse className="h-4 w-4 mr-2 text-blue-600" />
                      Standard Dock Heights
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Warehouse A:</span>
                        <span className="font-medium">48 inches</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Warehouse B:</span>
                        <span className="font-medium">52 inches</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Distribution Center C:</span>
                        <span className="font-medium">50 inches</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium flex items-center mb-2">
                      <Truck className="h-4 w-4 mr-2 text-blue-600" />
                      Truck Size Limitations
                    </h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Warehouse A:</span>
                        <span className="font-medium">Up to 53' trailers</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Warehouse B:</span>
                        <span className="font-medium">Up to 48' trailers</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Distribution Center C:</span>
                        <span className="font-medium">Up to 53' trailers</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Equipment Availability</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium flex items-center mb-2">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-blue-600" />
                      Forklifts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Available at all facilities during operating hours. 5,000 lb capacity.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium flex items-center mb-2">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-blue-600" />
                      Pallet Jacks
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Available at all facilities. Both manual and electric available.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium flex items-center mb-2">
                      <ArrowUpDown className="h-4 w-4 mr-2 text-blue-600" />
                      Lift Gates
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Available at Warehouse A and Distribution Center C only.
                    </p>
                  </div>
                </div>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Special Requirements</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>All refrigerated deliveries must use docks with temperature control capabilities</li>
                    <li>Carriers must provide their own dock plates if needed</li>
                    <li>All drivers must check in at security upon arrival</li>
                    <li>Proof of appointment required at facilities with appointment requirements</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="guidelines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Guidelines</CardTitle>
              <CardDescription>
                Information for carriers delivering to or picking up from our facilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Scheduling Requirements</h3>
                <div className="rounded-lg border p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Schedule appointments at least 24 hours in advance for all facilities requiring appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Provide BOL number, PO number, and estimated arrival time when scheduling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Notify facility of any delays or changes to scheduled appointments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Arrive within 30 minutes of scheduled appointment time to avoid rescheduling</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Loading/Unloading Procedures</h3>
                <div className="rounded-lg border p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Drivers must check in at security or reception upon arrival</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>All drivers must wear safety vests while in the loading dock area</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Drivers may be required to assist with loading/unloading depending on the facility</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>All paperwork must be signed before departure</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Safety Requirements</h3>
                <div className="rounded-lg border p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Follow all posted safety signs and instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Maximum speed limit of 5 MPH in all facility areas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>No smoking anywhere on facility premises</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span>Report any accidents or incidents immediately to facility management</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Failure to comply with these guidelines may result in delayed loading/unloading or denial of service. All carriers are expected to adhere to these requirements for safe and efficient operations.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Download Carrier Guidelines PDF
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
