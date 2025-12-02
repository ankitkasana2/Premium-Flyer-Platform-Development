"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Music,
  Check,
  TestTube,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useStore } from "@/stores/StoreProvider";
import { toJS } from "mobx";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SponsorsBlock from "./sponser";
import ExtrasBlock from "./extra-block";
import DeliveryTimeBlock from "./delivery-time-block";
import { FlyersCarousel } from "../home/FlyersCarousel";
import HostSection from "./host-block";
import EventDetails from "./event-details";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner"
import { useSearchParams, useParams } from "next/navigation";
import { getApiUrl } from "@/config/api";
import type { FlyerFormDetails } from "@/stores/FlyerFormStore";

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Item {
  name: string;
  price: number;
  quantity: number;
}

interface Props {
  items: Item[];
}


type Flyer = {
  id: string;
  name: string;
  category: string;
  price: number;
  priceType: "basic" | "regular" | "premium";
  hasPhotos: boolean;
  imageUrl: string;
  image_url?: string;
  category_id?: string;
  tags: string[];
  isRecentlyAdded?: boolean;
  isFeatured?: boolean;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const formatCurrency = (value: number | string | null | undefined) => {
  const numericValue = typeof value === "number" ? value : Number(value ?? 0);
  if (Number.isNaN(numericValue)) {
    return currencyFormatter.format(0);
  }
  return currencyFormatter.format(numericValue);
};

type CheckoutPayloadOptions = {
  userId?: string;
  flyerId?: string;
  categoryId?: string;
  subtotal?: number;
  image_url?: string;
};

const mapToApiRequest = (
  data: FlyerFormDetails,
  options: CheckoutPayloadOptions = {}
) => {
  const extras = data?.extras ?? {
    storySizeVersion: false,
    customFlyer: false,
    animatedFlyer: false,
    instagramPostSize: true
  };

  const sponsors = data?.sponsors ?? {};
  const normalizeSponsor = (file?: File | null) => ({
    name: file?.name ?? ""
  });

  return {
    presenting: data?.eventDetails?.presenting || "Presenting Event", // Ensure non-null default value
    event_title: data?.eventDetails?.mainTitle || "Event Title", // Ensure non-null default value

    event_date: data?.eventDetails?.date
      ? new Date(data.eventDetails.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0], // Default to today

    flyer_info: data?.eventDetails?.flyerInfo || "Event Information", // Ensure non-null default value
    address_phone: data?.eventDetails?.addressAndPhone || "Address and Phone", // Ensure non-null default value

    djs: Array.isArray(data?.djsOrArtists)
      ? data.djsOrArtists.map((dj: any) => ({
          name: dj?.name || "DJ Name" // Ensure non-null default value
        }))
      : [{ name: "DJ Name" }, { name: "DJ Name" }], // Ensure at least 2 DJs

    host: {
      name: data?.host?.name || "Host Name" // Ensure non-null default value
    },

    sponsors: [
      normalizeSponsor(sponsors.sponsor1),
      normalizeSponsor(sponsors.sponsor2),
      normalizeSponsor(sponsors.sponsor3)
    ],

    story_size_version: extras.storySizeVersion ?? false,
    custom_flyer: extras.customFlyer ?? false,
    animated_flyer: extras.animatedFlyer ?? false,
    instagram_post_size: extras.instagramPostSize ?? false,

    custom_notes: data?.customNote || "Custom Notes", // Ensure non-null default value
    flyer_id: options.flyerId ?? data?.flyerId ?? "1", // Default flyer ID
    category_id: options.categoryId ?? data?.categoryId ?? "1", // Default category ID
    user_id: options.userId ?? data?.userId ?? "", // User ID should come from auth
    delivery_time: data?.deliveryTime ?? "24hours", // Default delivery time
    total_price: options.subtotal ?? data?.subtotal ?? 0,

    venue_logo: "",
    host_file: "",
    dj_0: "",
    dj_1: "",
    sponsor_0: "",
    sponsor_1: "",
    sponsor_2: "",
    // ✅ ADD THIS FIELD
  image_url: options.image_url ?? "",
  };
};

const EventBookingForm = () => {
  const searchParams = useSearchParams();
  const params = useParams();

  const image = searchParams.get("image");
  const name = searchParams.get("name");
  const priceFromQuery = Number(searchParams.get("price") ?? "0");
  const categoryFromQuery = searchParams.get("category") ?? undefined;
  const routeFlyerId =
    typeof params?.FlyerId === "string"
      ? params.FlyerId
      : Array.isArray(params?.FlyerId)
        ? params?.FlyerId[0]
        : undefined;

  const { flyerFormStore, cartStore, authStore } = useStore();

  const [flyer, setFlyer] = useState<Flyer | undefined>(undefined);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [djList, setDjList] = useState<
    { name: string; image: string | null }[]
  >([
    { name: "", image: null },
    { name: "", image: null },
  ]);

  const [djListText, setDjListText] = useState<
    { name: string }[]
  >([
    { name: "" },
    { name: "" },
  ]);

  const flyerImage = flyer?.image_url || flyer?.imageUrl || image || "/placeholder.svg";
  const flyerName = flyer?.name || name || "";
  const basePrice = flyer?.price ?? priceFromQuery;
  const computedSubtotal = flyerFormStore.subtotal;
  const totalDisplay = computedSubtotal > 0 ? computedSubtotal : basePrice;

  useEffect(() => {
    if (routeFlyerId) {
      flyerFormStore.setFlyerId(routeFlyerId);
    }
  }, [routeFlyerId, flyerFormStore]);

  useEffect(() => {
    const categoryId =
      (flyer as any)?.category_id ??
      flyer?.category ??
      categoryFromQuery;

    if (categoryId) {
      flyerFormStore.setCategoryId(String(categoryId));
    }
  }, [flyer, categoryFromQuery, flyerFormStore]);

  useEffect(() => {
    const priceCandidate = flyer?.price ?? priceFromQuery;
    if (priceCandidate && !Number.isNaN(priceCandidate)) {
      flyerFormStore.setBasePrice(priceCandidate);
    }
  }, [flyer?.price, priceFromQuery, flyerFormStore]);



  // ✅ Handle DJ name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    flyerFormStore.updateDJ(index, "name", e.target.value)


    // 3️⃣ Update local UI preview (if you’re using local state for preview)
    if (flyer?.hasPhotos == true) {
      setDjList((prev) => {
        const newList = [...prev];
        newList[index].name = e.target.value; // base64 preview
        return newList;
      })
    } else {
      setDjListText((prev) => {
        const newList2 = [...prev];
        newList2[index].name = e.target.value
        return newList2;
      })
    }
  }

  // ✅ Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1️⃣ Update the MobX store with the raw File
      flyerFormStore.updateDJ(index, "image", file);

      // 2️⃣ Create a preview using FileReader
      const reader = new FileReader();
      reader.onload = () => {
        // 3️⃣ Update local UI preview (if you’re using local state for preview)
        setDjList((prev) => {
          const newList = [...prev];
          newList[index].image = reader.result as string; // base64 preview
          return newList;
        });
      };
      reader.readAsDataURL(file); // 4️⃣ Convert file → base64
    }
  };


  // ✅ Remove image
  const handleRemoveImage = (index: number) => {
    flyerFormStore.updateDJ(index, "image", null)
    setDjList((prev) => {
      const newList = [...prev];
      newList[index].image = null;
      return newList;
    });
  }

  // ✅ Add new DJ field
  const handleAddField = () => {
    flyerFormStore.addDJ()
    if (flyer?.hasPhotos == true) {
      setDjList(prev => [...prev, { name: "", image: null }])
    } else {
      setDjListText(prev => [...prev, { name: '' }])
    }


  }

  const handleRemoveField = (index: number) => {
    flyerFormStore.removeDJ(index);

    if (flyer?.hasPhotos === true) {
      setDjList(prev => prev.filter((_, i) => i !== index));
    } else {
      setDjListText(prev => prev.filter((_, i) => i !== index));
    }
  };


  useEffect(() => {
    // whenever store.flyer changes, update local state
    setFlyer(flyerFormStore.flyer ?? undefined);
  }, [flyerFormStore.flyer]);


  // submit function 
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!authStore.user?.id) {
  //     toast.error("Please sign in to continue with checkout.");
  //     authStore.handleAuthModal();
  //     return;
  //   }

  //   const { valid, errors } = flyerFormStore.validateForm();
  //   if (!valid) {
  //     toast.error(errors.join("\n"));
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   flyerFormStore.setUserId(authStore.user.id);

  //   const apiBody = mapToApiRequest(flyerFormStore.flyerFormDetail, {
  //     userId: authStore.user.id,
  //     flyerId: flyer?.id ?? flyerFormStore.flyerFormDetail.flyerId,
  //     categoryId:
  //       (flyer as any)?.category_id ??
  //       flyer?.category ??
  //       flyerFormStore.flyerFormDetail.categoryId,
  //     subtotal: totalDisplay,
  //     image_url: image || ""
  //   });

  //   const handleCreate = async () => {
  //     const res = await fetch(getApiUrl("/api/orders"), {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(apiBody)
  //     });

  //     const data = await res.json();
  //     if (data.url) {
  //       window.location.href = data.url; // Redirect to Stripe Checkout
  //     } else {
  //       toast.error("Checkout URL not generated. Please try again.");
  //       console.error("Stripe session response:", data);
  //     }
  //   };

  //   const handleCheckout = async () => {
  //     const res = await fetch("/api/checkout/session", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         item: {
  //           ...flyerFormStore.flyerFormDetail,
  //           subtotal: totalDisplay
  //         }
  //       })
      
  //     }
  //   );

  //     const data = await res.json();
  //     if (data.url) {
  //       window.location.href = data.url; // Redirect to Stripe Checkout
  //     } else {
  //       toast.error("Checkout URL not generated. Please try again.");
  //       console.error("Stripe session response:", data);
  //     }
  //   };

  //   try {
  //      await handleCheckout();
  //     await handleCreate();
     
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!authStore.user?.id) {
    toast.error("Please sign in to continue with checkout.");
    authStore.handleAuthModal();
    return;
  }

  const { valid, errors } = flyerFormStore.validateForm();
  if (!valid) {
    toast.error(errors.join("\n"));
    return;
  }

  setIsSubmitting(true);
  flyerFormStore.setUserId(authStore.user.id);

  const apiBody = mapToApiRequest(flyerFormStore.flyerFormDetail, {
    userId: authStore.user.id,
    flyerId: flyer?.id ?? flyerFormStore.flyerFormDetail.flyerId,
    categoryId:
      (flyer as any)?.category_id ??
      flyer?.category ??
      flyerFormStore.flyerFormDetail.categoryId,
    subtotal: totalDisplay,
    image_url: image || ""
  });

  // Store order data in session storage for post-payment processing
  const orderData = {
    ...apiBody,
    web_user_id: authStore.user.id,
    email: authStore.user.email || authStore.user.name || 'unknown@example.com',
    // Store file references
    hasImage: !!image,
    hasVenueLogo: !!flyerFormStore.flyerFormDetail.eventDetails.venueLogo,
    djImages: flyerFormStore.flyerFormDetail.djsOrArtists.map(dj => !!dj.image),
    hostImage: !!flyerFormStore.flyerFormDetail.host?.image,
    sponsorImages: Object.values(flyerFormStore.flyerFormDetail.sponsors).map(s => !!s)
  };

  // Store in session storage
  console.log('Storing order data in sessionStorage:', orderData);
  sessionStorage.setItem('pendingOrder', JSON.stringify(orderData));
  console.log('SessionStorage after storing:', Object.keys(sessionStorage));

  try {
    // Only call checkout session here
    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: { ...apiBody, subtotal: totalDisplay } })
    });

    // don't call res.json() before checking ok
    if (!res.ok) {
      const text = await res.text().catch(() => null);
      console.error("Checkout session error response:", text);
      toast.error("Unable to create checkout session. Please try again.");
      return;
    }

    const data = await res.json();
    if (data?.url) {
      // redirect to Stripe (this will navigate away)
      window.location.href = data.url;
      return;
    } else {
      console.error("Stripe response missing url", data);
      toast.error("Checkout URL not generated. Please try again.");
    }
  } catch (err) {
    console.error("Checkout error", err);
    toast.error("An error occurred during checkout. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};

// Test order function
const handleTestOrder = async () => {
  console.log('🧪 Test order button clicked!');
  
  if (!authStore.user?.id) {
    console.log('❌ User not logged in');
    toast.error("Please sign in to create a test order.");
    authStore.handleAuthModal();
    return;
  }

  console.log('✅ User logged in:', authStore.user.id);

  const { valid, errors } = flyerFormStore.validateForm();
  console.log('📋 Form validation:', { valid, errors });
  
  if (!valid) {
    console.log('❌ Form validation failed:', errors);
    toast.error(errors.join("\n"));
    return;
  }

  console.log('✅ Form validation passed');
  setIsSubmitting(true);
  flyerFormStore.setUserId(authStore.user.id);

  try {
    console.log('🚀 Starting test order creation...');
    
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Get the form data
    const apiBody = mapToApiRequest(flyerFormStore.flyerFormDetail, {
      userId: authStore.user.id,
      flyerId: flyer?.id ?? flyerFormStore.flyerFormDetail.flyerId,
      categoryId:
        (flyer as any)?.category_id ??
        flyer?.category ??
        flyerFormStore.flyerFormDetail.categoryId,
      subtotal: totalDisplay,
      image_url: image || ""
    });

    console.log('📦 API body prepared:', apiBody);

    // Add individual form fields (matching Postman format)
    formData.append('presenting', apiBody.presenting);
    formData.append('event_title', apiBody.event_title);
    formData.append('event_date', apiBody.event_date);
    formData.append('flyer_info', apiBody.flyer_info);
    formData.append('address_phone', apiBody.address_phone);
    
    // Add DJs as JSON string
    formData.append('djs', JSON.stringify(apiBody.djs));
    
    // Add host as JSON string
    formData.append('host', JSON.stringify(apiBody.host));
    
    // Add sponsors as JSON string
    formData.append('sponsors', JSON.stringify(apiBody.sponsors));
    
    // Add boolean fields
    formData.append('story_size_version', apiBody.story_size_version.toString());
    formData.append('custom_flyer', apiBody.custom_flyer.toString());
    formData.append('animated_flyer', apiBody.animated_flyer.toString());
    formData.append('instagram_post_size', apiBody.instagram_post_size.toString());
    
    // Add other fields
    formData.append('delivery_time', apiBody.delivery_time);
    formData.append('custom_notes', apiBody.custom_notes);
    formData.append('flyer_is', apiBody.flyer_id);
    
    // Add user information
    console.log('👤 User object:', authStore.user);
    console.log('📧 User email:', authStore.user.email);
    console.log('👤 User name:', authStore.user.name);
    formData.append('web_user_id', authStore.user.id);
    formData.append('email', authStore.user.email || authStore.user.name || 'unknown@example.com');

    // Add files if they exist
    if (image && typeof image === 'object' && 'name' in image && 'size' in image) {
      console.log('🖼️ Adding image file:', image.name);
      formData.append('image', image as File);
    }

    // Add venue logo if it exists
    if (flyerFormStore.flyerFormDetail.eventDetails.venueLogo) {
      const venueLogo = flyerFormStore.flyerFormDetail.eventDetails.venueLogo;
      if (typeof venueLogo === 'object' && venueLogo !== null && 'name' in venueLogo && 'size' in venueLogo) {
        console.log('🏢 Adding venue logo:', venueLogo.name);
        formData.append('venue_logo', venueLogo as File);
      }
    }

    // Add DJ/Artist images
    flyerFormStore.flyerFormDetail.djsOrArtists.forEach((dj, index) => {
      if (dj.image && 
          typeof dj.image === 'object' && 
          dj.image !== null && 
          'name' in dj.image && 
          'size' in dj.image) {
        console.log(`🎵 Adding DJ ${index} image:`, dj.image.name);
        formData.append(`dj_${index}`, dj.image as File);
      }
    });

    // Add host image
    if (flyerFormStore.flyerFormDetail.host?.image && 
        typeof flyerFormStore.flyerFormDetail.host.image === 'object' && 
        flyerFormStore.flyerFormDetail.host.image !== null && 
        'name' in flyerFormStore.flyerFormDetail.host.image && 
        'size' in flyerFormStore.flyerFormDetail.host.image) {
      console.log('🎤 Adding host image:', flyerFormStore.flyerFormDetail.host.image.name);
      formData.append('host', flyerFormStore.flyerFormDetail.host.image as File);
    }

    // Add sponsor images
    Object.entries(flyerFormStore.flyerFormDetail.sponsors).forEach(([key, sponsor]) => {
      if (sponsor && 
          typeof sponsor === 'object' && 
          sponsor !== null && 
          'name' in sponsor && 
          'size' in sponsor) {
        console.log(`🏷️ Adding sponsor ${key} image:`, sponsor.name);
        formData.append(`sponsor_${key}`, sponsor as File);
      }
    });

    console.log("📤 Submitting test order with FormData:", {
      dataKeys: Array.from(formData.keys()),
      hasFiles: formData.has('image') || formData.has('venue_logo'),
      userId: authStore.user.id
    });

    console.log('🌐 Calling /api/test-order endpoint...');
    
    // Send test order to dedicated test-order API
    const response = await fetch("/api/test-order", {
      method: "POST",
      body: formData,
    });

    console.log('📬 Response status:', response.status);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error("❌ Test order error:", errorData);
      toast.error(`Test order failed: ${errorData.message || "Please try again."}`);
      return;
    }

    const result = await response.json();
    console.log("✅ Test order success:", result);
    
    toast.success("🎉 Test order created successfully!");
    
    // Show order details
    if (result.orderId) {
      toast.success(`📋 Order ID: ${result.orderId}`);
    }
    if (result.data?.id) {
      toast.success(`📋 Order ID: ${result.data.id}`);
    }

  } catch (error: any) {
    console.error("❌ Test order error:", error);
    toast.error(`Test order failed: ${error.message || "Please try again."}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // add to cart function 
  const addtoCart = async (id?: string) => {
    const resolvedFlyerId =
      id ??
      flyer?.id ??
      flyerFormStore.flyerFormDetail.flyerId;

    if (!resolvedFlyerId) {
      toast.error("Please select a flyer first.");
      return;
    }

    // alert("User ID: " + authStore.user?.id);
    if (!authStore.user?.id) {
      toast.error("Please sign in to add items to your cart.");
      authStore.handleAuthModal();
      return;
    }

    const { valid, errors } = flyerFormStore.validateForm();
    if (!valid) {
      toast.error(errors.join("\n"));
      return;
    }

    flyerFormStore.setUserId(authStore.user.id);

    const cartPayload = mapToApiRequest(flyerFormStore.flyerFormDetail, {
      // userId: authStore.user.id,
      userId: "10",  // temporary user id for testing
      flyerId: resolvedFlyerId,
      categoryId:
        (flyer as any)?.category_id ??
        flyer?.category ??
        flyerFormStore.flyerFormDetail.categoryId,
      subtotal: totalDisplay,
      image_url: image || ""// temporary image url for testing
    });
    // alert("Cart Payload: " + JSON.stringify(cartPayload));

    try {
      await cartStore.addToCart(resolvedFlyerId, authStore.user.id, cartPayload);
      toast.success("Added to cart. You can keep shopping.");
    } catch (error) {
      console.error("Cart save error", error);
      toast.error("Unable to add to cart. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="grid lg:grid-cols-2 gap-8 p-3 md:p-5 max-w-[1600px] mx-auto">
        {/* Left Side - Event Flyer */}
        <div className="space-y-6">
          <div className="relative bg-gradient-to-br from-orange-900/20 via-black to-purple-900/20 rounded-2xl overflow-hidden  glow-effect transition-all duration-300 ">


            <div className="relative p-3 md:p-6 space-y-4">
              <div className="space-y-2 float-effect flex justify-between items-center">
                <h1
                  className="text-xl md:text-2xl font-bold text-white "

                >
                  {flyerName}
                </h1>

                {/* Price Section */}
                <div className="flex">

                  <span className="text-sm font-semibold text-white border-1 border-primary px-4 py-1 rounded-md shadow-md">
                    {formatCurrency(basePrice)}
                  </span>

                </div>
              </div>

              <div className="aspect-[4/5]  rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-primary hover:scale-[1.02]">
                <img
                  src={flyerImage}
                  alt={flyerName || "Event promotional image"}
                  className="w-full h-full object-cover"
                />
              </div>


            </div>
          </div>
        </div>


        {/* Right Side - Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Event Details Section */}
          <EventDetails />

          {/* Additional Information Section */}
          <div
            className="space-y-4 bg-gradient-to-br from-red-950/20 to-black p-4 
        rounded-2xl border border-gray-800"
          >
            <h2 className="text-xl font-bold">DJ or Artist</h2>

            {flyer?.hasPhotos == true ? djList.map((dj, index) => (
              <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold flex items-center gap-2">
                      <Music className="w-4 h-4 text-theme text-sm" />
                      Main DJ or Artist {index + 1}
                    </Label>

                    <div className="flex items-center gap-4">
                      {/* Upload */}
                      <label htmlFor={`dj-upload-${index}`} className="cursor-pointer">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="text-sm font-semibold">Upload Image</span>
                          <Upload className="w-4 h-4" />
                        </div>
                        <input
                          id={`dj-upload-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, index)}
                          className="hidden"
                        />
                      </label>

                      {/* Remove Field Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 h-10 shadow-md
                hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)]
                transition-all duration-300"
                  >
                    {dj.image && (
                      <>
                        <img
                          src={dj.image}
                          alt="DJ"
                          className="w-8 h-8 rounded-full object-fill border-2 border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="text-primary text-xs hover:underline"
                        >
                          Remove Image
                        </button>
                      </>
                    )}

                    <Input
                      value={dj.name}
                      onChange={(e) => handleNameChange(e, index)}
                      placeholder="Enter DJ name..."
                      className="bg-transparent border-none text-white placeholder:text-gray-600 
                  focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />

                    <span className="text-gray-500 text-sm whitespace-nowrap">
                      {dj.image ? "Image uploaded" : "No file chosen"}
                    </span>
                  </div>
                </div>
              </div>
            ))
              :
              djListText.map((dj, index) => (
                <div key={index} className="grid grid-cols-2 gap-6 mb-4">
                  <div className="col-span-2">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Music className="w-4 h-4 text-theme text-sm" />
                        Main DJ or Artist {index + 1}
                      </Label>

                      {/* Remove Field Button (same as photo version) */}
                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="text-primary cursor-pointer text-xs hover:underline"
                      >
                        Remove Field
                      </button>
                    </div>

                    <div
                      className="flex items-center gap-3 bg-gray-950 border rounded-lg p-3 h-10 shadow-md
        hover:border-primary hover:shadow-[0_0_15px_rgba(185,32,37,0.8)]
        transition-all duration-300"
                    >
                      <Input
                        value={dj.name}
                        onChange={(e) => handleNameChange(e, index)}
                        placeholder="Enter DJ name..."
                        className="bg-transparent border-none text-white placeholder:text-gray-600 
          focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      />
                    </div>
                  </div>
                </div>
              ))
            }

            <Button
              type="button"
              onClick={handleAddField}
              className="mt-2 bg-primary hover:cursor-pointer"
            >
              Add More
            </Button>
          </div>

          {/* Host Information Section */}
          <HostSection />

          {/* sponser Section */}
          <SponsorsBlock />

          {/* Extras Section */}
          <ExtrasBlock />

          {/* Delivery Time Section */}
          <DeliveryTimeBlock />

          {/* Note Section */}
          <div className="space-y-2">
            <Textarea
              value={note}
              rows={3}
              onChange={(e) => (setNote(e.target.value), flyerFormStore.updateCustomNote(e.target.value))}
              placeholder="Custom note..."
              className="bg-gray-950 border border-gray-800 text-white
             placeholder:text-gray-600 rounded-lg 
             shadow-md
             focus-visible:!ring-0 focus-visible:!outline-none
             focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
             transition-all duration-300"
            />
          </div>

          {/* Submit Section */}
          <div
            className="bg-gradient-to-br from-red-950/30 to-black p-4 rounded-2xl border border-gray-800 
          flex items-center justify-between"
          >
            <div className="flex gap-4 justify-center items-center">
              {/* Test Order Button */}
              {/* <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleTestOrder}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    Testing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <TestTube className="w-4 h-4" />
                    Test Order
                  </span>
                )}
              </Button> */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-red-550 text-white px-3 
               rounded-lg hover:cursor-pointer transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Checkout Now
                  </span>
                )}
              </Button>

              {/* Add to Cart Button */}
              <Button
                type="button"
                variant={'outline'}
                className="hover:cursor-pointer"
                onClick={() => addtoCart(flyer?.id)}
              >
                Add To Cart
              </Button>

            </div>
            {/* Right: Total Amount */}
            <div className="text-right">
              <span className="block text-sm text-gray-300 font-semibold">
                Total
              </span>
              <span className="text-primary font-bold text-lg">
                {formatCurrency(totalDisplay)}
              </span>
            </div>
          </div>
        </form>
      </div>
      {/* Similar Flyers */}
      <div className="space-y-4 p-4  rounded-2xl mt-10">
        <h3 className="text-xl font-bold text-white">Similar Flyers</h3>

        <div className="">
          <FlyersCarousel flyers={flyerFormStore.similarFlyers} />
        </div>
      </div>
    </div>
  );
};

export default observer(EventBookingForm);
