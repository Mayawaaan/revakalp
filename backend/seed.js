import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/product.model.js";
import connectDB from "./src/lib/db.js";

dotenv.config();

const products = [

    /* ================= ANDHRA PRADESH ================= */
    { name:"Mangalagiri Cotton Saree", description:"Handwoven Mangalagiri cotton saree with fine zari borders.", price:1800, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600101, bestseller:false, print:"Zari Border", exclusivity:"Handloom" },
    { name:"Uppada Jamdani Saree", description:"Lightweight Uppada Jamdani silk saree with intricate weaving.", price:6200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600102, bestseller:true, print:"Jamdani", exclusivity:"Heritage" },
    { name:"Venkatagiri Silk Saree", description:"Soft Venkatagiri silk saree with traditional motifs.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600103, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Dharmavaram Silk Saree", description:"Heavy Dharmavaram silk saree known for grand zari borders.", price:7200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600104, bestseller:true, print:"Zari", exclusivity:"Royal" },
    { name:"Narayanpet Cotton Saree", description:"Traditional Narayanpet cotton saree with geometric patterns.", price:2000, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600105, bestseller:false, print:"Geometric", exclusivity:"Handloom" },
    { name:"Gadwal Silk Saree", description:"Gadwal saree with cotton body and rich silk borders.", price:4200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk Blend", subCategory:"Festive", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600106, bestseller:true, print:"Zari Border", exclusivity:"Heritage" },
    { name:"Pochampally Ikat Saree", description:"Classic Pochampally Ikat saree with bold geometric designs.", price:3600, image:["https://images.unsplash.com/photo-1617093727343"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Andhra Pradesh", sizes:["Free Size"], date:1716600107, bestseller:true, print:"Ikat", exclusivity:"Handloom" },
    
    /* ================= TELANGANA ================= */
    { name:"Pochampally Ikat Saree (GI)", description:"GI-tagged Pochampally Ikat saree woven with resist-dyed yarns.", price:3900, image:["https://images.unsplash.com/photo-1617093727343"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Telangana", sizes:["Free Size"], date:1716600201, bestseller:true, print:"Ikat", exclusivity:"GI" },
    { name:"Gadwal Silk Cotton Saree", description:"Gadwal saree with silk borders and breathable cotton body.", price:4400, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk Blend", subCategory:"Festive", type:"Saree", gender:"Women", state:"Telangana", sizes:["Free Size"], date:1716600202, bestseller:true, print:"Zari Border", exclusivity:"Heritage" },
    { name:"Narayanpet Silk Saree", description:"Narayanpet silk saree with temple-style borders.", price:4200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Telangana", sizes:["Free Size"], date:1716600203, bestseller:false, print:"Traditional", exclusivity:"Handloom" },
    { name:"Sircilla Silk Saree", description:"Fine Sircilla silk saree known for smooth texture.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Telangana", sizes:["Free Size"], date:1716600204, bestseller:true, print:"Solid Zari", exclusivity:"Heritage" },
    { name:"Hyderabad Himroo Mashru Saree", description:"Luxury Hyderabad saree with Himroo and Mashru weaving.", price:6800, image:["https://images.unsplash.com/photo-1583391733956"], category:"Silk", subCategory:"Luxury", type:"Saree", gender:"Women", state:"Telangana", sizes:["Free Size"], date:1716600205, bestseller:true, print:"Weave", exclusivity:"Royal" },
    
    /* ================= TAMIL NADU ================= */
    { name:"Kanjivaram Silk Saree", description:"Pure Kanchipuram silk saree with rich zari borders.", price:7800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600301, bestseller:true, print:"Zari", exclusivity:"Heritage" },
    { name:"Arani Silk Saree", description:"Arani silk saree with fine weaving and vibrant colors.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600302, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Salem Silk Saree", description:"Salem silk saree with smooth texture and durability.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600303, bestseller:false, print:"Solid", exclusivity:"Handloom" },
    { name:"Chettinad Cotton Saree", description:"Bold Chettinad cotton saree with checks and stripes.", price:2200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600304, bestseller:true, print:"Checks", exclusivity:"Handloom" },
    { name:"Coimbatore Cotton Saree", description:"Durable Coimbatore cotton saree for everyday wear.", price:1900, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600305, bestseller:false, print:"Solid", exclusivity:"Handloom" },
    { name:"Madurai Sungudi Saree", description:"Traditional Madurai tie-dyed Sungudi cotton saree.", price:2100, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Tamil Nadu", sizes:["Free Size"], date:1716600306, bestseller:true, print:"Tie Dye", exclusivity:"Handloom" },
    
    /* ================= KARNATAKA ================= */
    { name:"Mysore Silk Saree", description:"Pure Mysore silk saree with rich finish.", price:6400, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Karnataka", sizes:["Free Size"], date:1716600401, bestseller:true, print:"Solid Zari", exclusivity:"Heritage" },
    { name:"Ilkal Cotton Saree", description:"Ilkal cotton saree with signature red borders.", price:2100, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Karnataka", sizes:["Free Size"], date:1716600402, bestseller:false, print:"Temple Border", exclusivity:"Handloom" },
    { name:"Molakalmuru Silk Saree", description:"Molakalmuru silk saree with bold patterns.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Karnataka", sizes:["Free Size"], date:1716600403, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Khadi Cotton Saree", description:"Handspun Khadi cotton saree for sustainable fashion.", price:1800, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Karnataka", sizes:["Free Size"], date:1716600404, bestseller:false, print:"Plain", exclusivity:"Eco" },
    { name:"Bangalore Silk Saree", description:"Smooth Bangalore silk saree with rich drape.", price:5400, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Karnataka", sizes:["Free Size"], date:1716600405, bestseller:true, print:"Solid", exclusivity:"Heritage" },
    
    /* ================= KERALA ================= */
    { name:"Kasavu Saree", description:"Traditional Kerala Kasavu saree with gold border.", price:2200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Kerala", sizes:["Free Size"], date:1716600501, bestseller:true, print:"Gold Border", exclusivity:"Traditional" },
    { name:"Balaramapuram Saree", description:"Handwoven cotton saree from Balaramapuram.", price:2400, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Kerala", sizes:["Free Size"], date:1716600502, bestseller:false, print:"Traditional", exclusivity:"Handloom" },
    { name:"Kuthampully Saree", description:"Kerala Kuthampully saree with temple motifs.", price:2600, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Kerala", sizes:["Free Size"], date:1716600503, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Chendamangalam Saree", description:"Chendamangalam cotton saree with fine weaving.", price:2300, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Kerala", sizes:["Free Size"], date:1716600504, bestseller:false, print:"Plain", exclusivity:"Handloom" },
    
    /* ================= MAHARASHTRA ================= */
    { name:"Paithani Saree", description:"Royal Paithani silk saree with peacock motifs.", price:8200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Maharashtra", sizes:["Free Size"], date:1716600601, bestseller:true, print:"Zari Motif", exclusivity:"Royal" },
    { name:"Nauvari Saree", description:"Traditional 9-yard Maharashtrian saree.", price:2600, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Maharashtra", sizes:["Free Size"], date:1716600602, bestseller:false, print:"Solid", exclusivity:"Traditional" },
    { name:"Karvati Kinar Saree", description:"Maharashtrian saree with Karvati knife-edge border.", price:2800, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Maharashtra", sizes:["Free Size"], date:1716600603, bestseller:false, print:"Border", exclusivity:"Handloom" },
    { name:"Narayan Peth Saree", description:"Narayan Peth saree with bright colors and fine borders.", price:3000, image:["https://images.unsplash.com/photo-1600180758619"], category:"Silk Blend", subCategory:"Festive", type:"Saree", gender:"Women", state:"Maharashtra", sizes:["Free Size"], date:1716600604, bestseller:true, print:"Traditional", exclusivity:"Handloom" },
    { name:"Yeola Silk Saree", description:"Yeola silk saree with Paithani-style weaving.", price:6200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Maharashtra", sizes:["Free Size"], date:1716600605, bestseller:true, print:"Zari", exclusivity:"Heritage" },
    
    /* ================= GUJARAT ================= */
    { name:"Patola Silk Saree", description:"Double Ikat Patola saree from Patan.", price:9800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Luxury", type:"Saree", gender:"Women", state:"Gujarat", sizes:["Free Size"], date:1716600701, bestseller:true, print:"Double Ikat", exclusivity:"Royal" },
    { name:"Bandhani Saree", description:"Traditional Bandhani tie-dye saree from Gujarat.", price:2800, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Gujarat", sizes:["Free Size"], date:1716600702, bestseller:true, print:"Tie Dye", exclusivity:"Handcrafted" },
    { name:"Gharchola Saree", description:"Red and gold Gharchola saree worn in Gujarati weddings.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Gujarat", sizes:["Free Size"], date:1716600703, bestseller:true, print:"Checks", exclusivity:"Traditional" },
    { name:"Panetar Saree", description:"White Panetar bridal saree with red border.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Gujarat", sizes:["Free Size"], date:1716600704, bestseller:false, print:"Zari Border", exclusivity:"Traditional" },
    { name:"Mata-ni-Pachedi Saree", description:"Hand-painted Mata-ni-Pachedi textile saree.", price:4200, image:["https://images.unsplash.com/photo-1583391733956"], category:"Cotton", subCategory:"Art Wear", type:"Saree", gender:"Women", state:"Gujarat", sizes:["Free Size"], date:1716600705, bestseller:false, print:"Hand Painted", exclusivity:"Artisan" },
    
    /* ================= RAJASTHAN ================= */
    { name:"Bandhej Saree", description:"Traditional Rajasthani Bandhej tie-dye saree.", price:2600, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Rajasthan", sizes:["Free Size"], date:1716600801, bestseller:true, print:"Tie Dye", exclusivity:"Handcrafted" },
    { name:"Leheriya Saree", description:"Striped Leheriya saree symbolizing monsoon.", price:2400, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Rajasthan", sizes:["Free Size"], date:1716600802, bestseller:false, print:"Stripes", exclusivity:"Handcrafted" },
    { name:"Kota Doria Saree", description:"Lightweight Kota Doria saree with square weave.", price:1900, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Rajasthan", sizes:["Free Size"], date:1716600803, bestseller:true, print:"Checks", exclusivity:"Handloom" },
    { name:"Sanganeri Print Saree", description:"Bagru and Sanganeri block-printed saree.", price:2200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Rajasthan", sizes:["Free Size"], date:1716600804, bestseller:false, print:"Block Print", exclusivity:"Handcrafted" },
    
    /* ================= WEST BENGAL ================= */
    { name:"Baluchari Saree", description:"Narrative Baluchari silk saree depicting stories.", price:6400, image:["https://images.unsplash.com/photo-1583391733956"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600901, bestseller:true, print:"Story Weave", exclusivity:"Heritage" },
    { name:"Tant Cotton Saree", description:"Lightweight Bengal Tant cotton saree.", price:1500, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600902, bestseller:false, print:"Striped", exclusivity:"Handloom" },
    { name:"Jamdani Saree", description:"Fine Jamdani muslin saree with floral motifs.", price:5200, image:["https://images.unsplash.com/photo-1583391733956"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600903, bestseller:true, print:"Jamdani", exclusivity:"Heritage" },
    { name:"Garad Saree", description:"White Garad silk saree with red border.", price:3800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600904, bestseller:false, print:"Border", exclusivity:"Traditional" },
    { name:"Murshidabad Silk Saree", description:"Murshidabad silk saree with fine texture.", price:4800, image:["https.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600905, bestseller:true, print:"Motifs", exclusivity:"Handloom" },
    { name:"Kantha Embroidered Saree", description:"Hand-embroidered Kantha saree from Bengal.", price:4200, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Art Wear", type:"Saree", gender:"Women", state:"West Bengal", sizes:["Free Size"], date:1716600906, bestseller:false, print:"Embroidery", exclusivity:"Artisan" },
    
    /* ================= ODISHA ================= */
    { name:"Sambalpuri Ikat Saree", description:"Sambalpuri Ikat saree with geometric designs.", price:3600, image:["https://images.unsplash.com/photo-1617093727343"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Odisha", sizes:["Free Size"], date:1716601001, bestseller:true, print:"Ikat", exclusivity:"Handloom" },
    { name:"Bomkai Saree", description:"Bomkai saree with tribal motifs.", price:4200, image:["https://images.unsplash.com/photo-1617093727343"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Odisha", sizes:["Free Size"], date:1716601002, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Kotpad Saree", description:"Vegetable-dyed Kotpad cotton saree.", price:2600, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Odisha",.sizes:["Free Size"], date:1716601003, bestseller:false, print:"Natural Dye", exclusivity:"Tribal" },
    { name:"Khandua Saree", description:"Khandua silk saree used in temple rituals.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Religious", type:"Saree", gender:"Women", state:"Odisha", sizes:["Free Size"], date:1716601004, bestseller:false, print:"Script Motifs", exclusivity:"Traditional" },
    { name:"Berhampuri Patta Saree", description:"Berhampuri silk saree with striped borders.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Odisha", sizes:["Free Size"], date:1716601005, bestseller:true, print:"Stripes", exclusivity:"Handloom" },
    
    /* ================= ASSAM ================= */
    { name:"Muga Silk Saree", description:"Golden Muga silk saree from Assam.", price:8800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Luxury", type:"Saree", gender:"Women", state:"Assam", sizes:["Free Size"], date:1716601101, bestseller:true, print:"Traditional", exclusivity:"Rare" },
    { name:"Pat Silk Saree", description:"Soft Pat silk saree with elegant drape.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Assam", sizes:["Free Size"], date:1716601102, bestseller:false, print:"Motifs", exclusivity:"Handloom" },
    { name:"Eri Silk Saree", description:"Ahimsa Eri silk saree, cruelty-free silk.", price:4600, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Eco", type:"Saree", gender:"Women", state:"Assam", sizes:["Free Size"], date:1716601103, bestseller:true, print:"Plain", exclusivity:"Eco" },
    
    /* ================= BIHAR ================= */
    { name:"Bhagalpuri Tussar Saree", description:"Bhagalpur tussar silk saree.", price:5200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Bihar", sizes:["Free Size"], date:1716601201, bestseller:true, print:"Natural Texture", exclusivity:"Heritage" },
    { name:"Madhubani Print Saree", description:"Saree featuring Madhubani hand painting.", price:3600, image:["https://images.unsplash.com/photo-1583391733956"], category:"Cotton", subCategory:"Art Wear", type:"Saree", gender:"Women", state:"Bihar", sizes:["Free Size"], date:1716601202, bestseller:false, print:"Hand Painted", exclusivity:"Artisan" },
    
    /* ================= CHHATTISGARH ================= */
    { name:"Kosa Silk Saree", description:"Kosa silk saree from Chhattisgarh.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Chhattisgarh", sizes:["Free Size"], date:1716601301, bestseller:true, print:"Natural Texture", exclusivity:"Heritage" },
    { name:"Bastar Handloom Saree", description:"Tribal handloom saree from Bastar.", price:2800, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Chhattisgarh", sizes:["Free Size"], date:1716601302, bestseller:false, print:"Tribal", exclusivity:"Tribal" },
    
    /* ================= MADHYA PRADESH ================= */
    { name:"Chanderi Saree", description:"Lightweight Chanderi silk cotton saree.", price:3600, image:["https://images.unsplash.com/photo-1600180758619"], category:"Silk Blend", subCategory:"Office Wear", type:"Saree", gender:"Women", state:"Madhya Pradesh", sizes:["Free Size"], date:1716601401, bestseller:true, print:"Buti", exclusivity:"Handloom" },
    { name:"Maheshwari Saree", description:"Maheshwari saree with reversible borders.", price:3400, image:["https://images.unsplash.com/photo-1600180758619"], category:"Silk Blend", subCategory:"Festive", type:"Saree", gender:"Women", state:"Madhya Pradesh", sizes:["Free Size"], date:1716601402, bestseller:false, print:"Stripes", exclusivity:"Handloom" },
    { name:"Bastar Cotton Saree", description:"Handwoven Bastar cotton saree.", price:2200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Madhya Pradesh", sizes:["Free Size"], date:1716601403, bestseller:false, print:"Tribal", exclusivity:"Tribal" },
    
    /* ================= UTTAR PRADESH ================= */
    { name:"Banarasi Silk Saree", description:"Luxurious Banarasi silk saree from Varanasi.", price:5400, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Wedding", type:"Saree", gender:"Women", state:"Uttar Pradesh", sizes:["Free Size"], date:1716601501, bestseller:true, print:"Zari Brocade", exclusivity:"Heritage" },
    { name:"Jamawar Saree", description:"Jamawar shawl-style saree with intricate patterns.", price:6200, image:["https://images.unsplash.com/photo-1583391733956"], category:"Silk", subCategory:"Luxury", type:"Saree", gender:"Women", state:"Uttar Pradesh", sizes:["Free Size"], date:1716601502, bestseller:false, print:"Paisley", exclusivity:"Royal" },
    { name:"Chikankari Saree", description:"Lucknow Chikankari embroidered saree.", price:2800, image:["https://images.unsplash.com/photo-1600180758895"], category:"Cotton", subCategory:"Daily", type:"Saree", gender:"Women", state:"Uttar Pradesh", sizes:["Free Size"], date:1716601503, bestseller:true, print:"Embroidery", exclusivity:"Handcrafted" },
    
    /* ================= JHARKHAND ================= */
    { name:"Tussar Silk Saree", description:"Jharkhand tussar silk saree.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Festive", type:"Saree", gender:"Women", state:"Jharkhand", sizes:["Free Size"], date:1716601601, bestseller:true, print:"Natural Texture", exclusivity:"Heritage" },
    { name:"Santhal Tribal Saree", description:"Tribal woven saree by Santhal artisans.", price:2600, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Jharkhand", sizes:["Free Size"], date:1716601602, bestseller:false, print:"Tribal", exclusivity:"Tribal" },
    
    /* ================= HIMACHAL PRADESH ================= */
    { name:"Kullu Kinnauri Saree", description:"Shawl-style saree from Kullu and Kinnaur.", price:4200, image:["https://images.unsplash.com/photo-1583391733956"], category:"Wool Blend", subCategory:"Winter Wear", type:"Saree", gender:"Women", state:"Himachal Pradesh", sizes:["Free Size"], date:1716601701, bestseller:false, print:"Geometric", exclusivity:"Handloom" },
    
    /* ================= MANIPUR ================= */
    { name:"Moiraangphee Saree", description:"Traditional Moiraangphee saree from Manipur.", price:3200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Manipur", sizes:["Free Size"], date:1716601801, bestseller:false, print:"Traditional", exclusivity:"Handloom" },
    { name:"Leirum Phee Saree", description:"Elegant Leirum Phee handwoven saree.", price:3400, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Festive", type:"Saree", gender:"Women", state:"Manipur", sizes:["Free Size"], date:1716601802, bestseller:false, print:"Stripes", exclusivity:"Handloom" },
    
    /* ================= MEGHALAYA ================= */
    { name:"Eri Silk Saree", description:"Handwoven Eri silk saree from Meghalaya.", price:4800, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Eco", type:"Saree", gender:"Women", state:"Meghalaya", sizes:["Free Size"], date:1716601901, bestseller:true, print:"Plain", exclusivity:"Eco" },
    
    /* ================= TRIPURA ================= */
    { name:"Rignai Silk Saree", description:"Traditional Rignai silk saree from Tripura.", price:4200, image:["https://images.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Tripura", sizes:["Free Size"], date:1716602001, bestseller:false, print:"Traditional", exclusivity:"Handloom" },
    
    /* ================= NAGALAND ================= */
    { name:"Naga Tribal Weave Saree", description:"Bold Naga tribal weave saree.", price:3800, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Nagaland", sizes:["Free Size"], date:1716602101, bestseller:false, print:"Tribal", exclusivity:"Tribal" },
    
    /* ================= ARUNACHAL PRADESH ================= */
    { name:"Arunachal Tribal Saree", description:"Tribal silk and cotton saree from Arunachal.", price:4200, image:["https://images.unsplash.com/photo-1600180758619"], category:"Silk Blend", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Arunachal Pradesh", sizes:["Free Size"], date:1716602201, bestseller:false, print:"Tribal", exclusivity:"Tribal" },
    
    /* ================= SIKKIM ================= */
    { name:"Thara Silk Saree", description:"Traditional Thara silk saree from Sikkim.", price:4600, image:["https.unsplash.com/photo-1594633312681"], category:"Silk", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Sikkim", sizes:["Free Size"], date:1716602301, bestseller:false, print:"Traditional", exclusivity:"Handloom" },
    
    /* ================= GOA ================= */
    { name:"Kunbi Saree", description:"Traditional Kunbi saree from Goa.", price:2800, image:["https://images.unsplash.com/photo-1600180758619"], category:"Cotton", subCategory:"Ethnic", type:"Saree", gender:"Women", state:"Goa", sizes:["Free Size"], date:1716602401, bestseller:false, print:"Stripes", exclusivity:"Traditional" }
    
    ];

const generateUniqueProductCode = async (state) => {
    let code;
    let isUnique = false;
    const stateCode = state.substring(0, 2).toLowerCase();

    while (!isUnique) {
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
        code = `${stateCode}${randomNum}`;
        const existingProduct = await Product.findOne({ code });
        if (!existingProduct) {
            isUnique = true;
        }
    }
    return code;
};

const seedDB = async () => {
    await connectDB();
    await Product.deleteMany({});
    console.log("Products deleted");
    
    const productsWithCode = await Promise.all(products.map(async (product) => {
        const code = await generateUniqueProductCode(product.state);
        return { ...product, code };
    }));

    await Product.insertMany(productsWithCode);
    console.log("Products seeded");
};

seedDB().then(() => {
    mongoose.connection.close();
});
