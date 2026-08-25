import { reactive, ref, computed } from 'vue';
import type { 
  TabType, 
  Owner, 
  Pet, 
  Post, 
  Story, 
  Reel, 
  HealthLog, 
  LostFoundPost, 
  AdoptionListing, 
  Vet, 
  Appointment, 
  MarketplaceListing, 
  ChatConversation, 
  AppNotification,
  AiScanResult,
  PetReactionType
} from '../types';
import { 
  initialOwner, 
  initialPets, 
  initialStories, 
  initialPosts, 
  initialReels, 
  initialHealthLogs, 
  initialLostFound, 
  initialAdoptions, 
  initialVets, 
  initialAppointments, 
  initialMarketplace, 
  initialChats, 
  initialNotifications 
} from '../data/mockData';

// State
export const currentTab = ref<TabType>('feed');
export const isDarkMode = ref(false);
export const isCreateSheetOpen = ref(false);
export const selectedStory = ref<Story | null>(null);
export const activeChat = ref<ChatConversation | null>(null);
export const searchQuery = ref('');
export const activeHashtag = ref<string | null>(null);
export const activeProfileId = ref<string>('owner_me');
export const isCommentsModalOpen = ref(false);
export const activePostForComments = ref<Post | null>(null);
export const isProModalOpen = ref(false);

export const owner = reactive<Owner>({ ...initialOwner });
export const pets = reactive<Pet[]>([
  {
    ...initialPets[0],
    aiPersonality: 'Silly Goofball & Master Fetcher',
    energyLevel: 'High Zoomies'
  },
  {
    ...initialPets[1],
    aiPersonality: 'Aristocratic Sunbather & Secret Poet',
    energyLevel: 'Moderate'
  }
]);
export const stories = reactive<Story[]>([...initialStories]);
export const posts = reactive<Post[]>([...initialPosts]);
export const reels = reactive<Reel[]>([...initialReels]);
export const healthLogs = reactive<HealthLog[]>([...initialHealthLogs]);
export const lostFoundList = reactive<LostFoundPost[]>([...initialLostFound]);
export const adoptions = reactive<AdoptionListing[]>([...initialAdoptions]);
export const vets = reactive<Vet[]>([...initialVets]);
export const appointments = reactive<Appointment[]>([...initialAppointments]);
export const marketplace = reactive<MarketplaceListing[]>([...initialMarketplace]);
export const chats = reactive<ChatConversation[]>([...initialChats]);
export const notifications = reactive<AppNotification[]>([...initialNotifications]);

// AI Hub Reactive State
export const aiTriageMessages = reactive<{ id: string; sender: 'user' | 'ai'; text: string; severity?: 'low' | 'medium' | 'urgent'; timestamp: string }[]>([
  {
    id: 'ai_1',
    sender: 'ai',
    text: "Hello Alex! I am PawAI 🩺, your 24/7 Pet Care & Triage Assistant. Describe any symptom or dietary question about Waffles or Mochi, and I'll provide immediate triage guidance.",
    severity: 'low',
    timestamp: 'Just now'
  }
]);

export const isAiScanning = ref(false);
export const currentScanResult = ref<AiScanResult | null>(null);

// Computed
export const activePet = computed(() => {
  if (activeProfileId.value === 'owner_me') return null;
  return pets.find(p => p.id === activeProfileId.value) || null;
});

export const unreadNotificationsCount = computed(() => {
  return notifications.filter(n => !n.isRead).length;
});

export const unreadMessagesCount = computed(() => {
  return chats.reduce((acc, c) => acc + c.unreadCount, 0);
});

export const activePosts = computed(() => {
  if (activeHashtag.value) {
    return posts.filter(p => p.hashtags.includes(activeHashtag.value!));
  }
  return posts;
});

// Actions
export function setTab(tab: TabType) {
  currentTab.value = tab;
}

export function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function reactToPost(postId: string, reaction: PetReactionType) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  if (!post.reactions) {
    post.reactions = { paw: 0, nuzzle: 0, treat: 0, ball: 0, purr: 0 };
  }

  // If already selected the same reaction, toggle off
  if (post.selectedReaction === reaction) {
    post.reactions[reaction] = Math.max(0, post.reactions[reaction] - 1);
    post.selectedReaction = null;
    post.isLiked = false;
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    // If switching from another reaction
    if (post.selectedReaction && post.reactions[post.selectedReaction] > 0) {
      post.reactions[post.selectedReaction]--;
    } else {
      post.likesCount++;
    }
    post.selectedReaction = reaction;
    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
    post.isLiked = true;
  }
}

export function togglePostLike(postId: string) {
  reactToPost(postId, 'nuzzle');
}

export function togglePostSave(postId: string) {
  const post = posts.find(p => p.id === postId);
  if (post) {
    post.isSaved = !post.isSaved;
  }
}

export function addComment(postId: string, body: string, isAsPet: boolean = false) {
  const post = posts.find(p => p.id === postId);
  if (!post || !body.trim()) return;

  const authorName = isAsPet && pets[0] ? `${pets[0].name} (Golden)` : owner.displayName;
  const authorAvatar = isAsPet && pets[0] ? pets[0].avatarUrl : owner.avatarUrl;

  const newComment = {
    id: `c_${Date.now()}`,
    authorName,
    authorAvatar,
    isPet: isAsPet,
    body: body.trim(),
    createdAt: 'Just now',
    likesCount: 0
  };

  post.comments.push(newComment);
  post.commentsCount++;
}

export function toggleReelLike(reelId: string) {
  const reel = reels.find(r => r.id === reelId);
  if (reel) {
    reel.isLiked = !reel.isLiked;
    reel.likesCount += reel.isLiked ? 1 : -1;
  }
}

export function toggleReelSave(reelId: string) {
  const reel = reels.find(r => r.id === reelId);
  if (reel) {
    reel.isSaved = !reel.isSaved;
  }
}

export function openStory(story: Story) {
  selectedStory.value = story;
  story.hasUnseen = false;
}

export function closeStory() {
  selectedStory.value = null;
}

export function openComments(post: Post) {
  activePostForComments.value = post;
  isCommentsModalOpen.value = true;
}

export function closeComments() {
  isCommentsModalOpen.value = false;
  activePostForComments.value = null;
}

export function openChat(conversation: ChatConversation) {
  activeChat.value = conversation;
  conversation.unreadCount = 0;
}

export function openChatWith(name: string, avatar: string, petName?: string, defaultMsg?: string) {
  let chat = chats.find(c => c.participantName === name);
  if (!chat) {
    chat = {
      id: `chat_${Date.now()}`,
      participantId: `user_${Date.now()}`,
      participantName: name,
      participantAvatar: avatar,
      petName,
      lastMessage: defaultMsg || 'Started conversation',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      isOnline: true,
      messages: defaultMsg ? [
        {
          id: `m_${Date.now()}`,
          senderId: 'owner_me',
          isSelf: true,
          body: defaultMsg,
          timestamp: 'Just now'
        }
      ] : []
    };
    chats.unshift(chat);
  }
  activeChat.value = chat;
}

export function closeChat() {
  activeChat.value = null;
}

export function sendMessageToActiveChat(body: string) {
  if (!activeChat.value || !body.trim()) return;

  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: 'owner_me',
    isSelf: true,
    body: body.trim(),
    timestamp: 'Just now'
  };

  activeChat.value.messages.push(newMsg);
  activeChat.value.lastMessage = body.trim();
  activeChat.value.lastMessageTime = 'Just now';

  const currentChat = activeChat.value;
  setTimeout(() => {
    if (currentChat) {
      const replies = [
        "Aww that's fantastic! 🐾 Let's coordinate soon!",
        "Thanks so much for reaching out! Happy to help 🐶",
        "Sounds like a great plan! Talk soon 😊",
        "Purr-fect! Let me know if you need anything else 🐱"
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      currentChat.messages.push({
        id: `msg_reply_${Date.now()}`,
        senderId: currentChat.participantId,
        isSelf: false,
        body: randomReply,
        timestamp: 'Just now'
      });
      currentChat.lastMessage = randomReply;
      currentChat.lastMessageTime = 'Just now';
    }
  }, 1000);
}

// AI Specific Actions
export function sendAiTriageQuery(query: string) {
  if (!query.trim()) return;

  aiTriageMessages.push({
    id: `u_${Date.now()}`,
    sender: 'user',
    text: query,
    timestamp: 'Just now'
  });

  const q = query.toLowerCase();
  let aiResponse = "I've analyzed your question. Ensure your pet has plenty of fresh water and rest. If symptoms persist over 24 hours, booking a quick checkup with Dr. Evelyn Martinez is advised.";
  let severity: 'low' | 'medium' | 'urgent' = 'low';

  if (q.includes('chocolate') || q.includes('poison') || q.includes('grape') || q.includes('onion') || q.includes('bleeding')) {
    aiResponse = "🚨 CRITICAL TRIAGE ALERT: Ingesting this substance can be toxic to pets! Please contact your nearest emergency veterinary hospital immediately or call the ASPCA Animal Poison Control hotline.";
    severity = 'urgent';
  } else if (q.includes('vomit') || q.includes('diarrhea') || q.includes('limp') || q.includes('scratch')) {
    aiResponse = "⚠️ MODERATE ATTENTION: Mild gastrointestinal or muscular issue detected. Withhold heavy meals for 4 hours, provide small sips of water. If vomiting occurs more than twice or lethargy sets in, schedule a clinic visit.";
    severity = 'medium';
  } else if (q.includes('food') || q.includes('diet') || q.includes('weight') || q.includes('treat')) {
    aiResponse = "🥑 NUTRITION AI INSIGHT: For a Golden Retriever of 29.5kg, aim for 1,350 kcal/day split across 2 meals with at least 26% high-quality protein and Omega-3 fatty acids for joint and coat vitality.";
    severity = 'low';
  }

  setTimeout(() => {
    aiTriageMessages.push({
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: aiResponse,
      severity,
      timestamp: 'Just now'
    });
  }, 900);
}

export function runAiPetScan(_imageUrl?: string) {
  isAiScanning.value = true;
  currentScanResult.value = null;

  setTimeout(() => {
    isAiScanning.value = false;
    currentScanResult.value = {
      breedMatch: 'Golden Retriever (98.4% Purebred)',
      confidence: 98.4,
      detectedMood: 'Joyful & High Energy 🌟 (Relaxed ears, soft panting expression)',
      healthObservations: [
        'Coat density: Excellent sheen, zero matting detected',
        'Body Condition Score: Ideal 5/9 (Athletic lean)',
        'Eye clarity: Clear sclera, alert tracking',
        'Estimated Dental Cleanliness: 92% healthy enamel'
      ],
      nutritionAdvice: 'Maintain current caloric intake of 1,350 kcal/day + glucosamine supplement for hips.',
      funFact: 'Golden Retrievers have water-repellent double coats and webbed paws built for retrieving!'
    };
  }, 1600);
}

export function generateAiCaption(type: 'silly' | 'heartwarming' | 'dramatic' | 'poetic', _petName: string = 'Waffles'): { caption: string; tags: string[] } {
  const captions = {
    silly: {
      caption: `10/10 branch manager right here. I don't fetch sticks, I acquire lumber 🌲🐶 No one can stop my zoomies today!`,
      tags: ['zoomies', 'stickcollector', 'goodboy', 'doghumor', 'goldensofig']
    },
    heartwarming: {
      caption: `Golden hour walks with my favorite human ❤️ Every day with you is the best adventure of my life.`,
      tags: ['unconditionallove', 'petlife', 'goldenhour', 'companion', 'furever']
    },
    dramatic: {
      caption: `It has been 4.5 minutes since my last treat. Despair is setting in. The bowl is a barren wasteland. Send help 🍖🥺`,
      tags: ['dramadog', 'treatplease', 'starvingartist', 'petsoftiktok']
    },
    poetic: {
      caption: `Sunlight dancing through the pine needles, paws softly treading on mossy earth. The forest belongs to the brave 🐾✨`,
      tags: ['naturepup', 'wildandfree', 'goldenretriever', 'peaceful']
    }
  };

  return captions[type] || captions.silly;
}

export function addHealthRecord(record: Omit<HealthLog, 'id'>) {
  const newRecord: HealthLog = {
    id: `hl_${Date.now()}`,
    ...record
  };
  healthLogs.unshift(newRecord);
}

export function bookVetSlot(vetId: string, day: string, time: string, petId: string, reason: string) {
  const vet = vets.find(v => v.id === vetId);
  const pet = pets.find(p => p.id === petId) || pets[0];
  if (!vet || !vet.slots[day]) return false;

  const slot = vet.slots[day].find(s => s.time === time);
  if (!slot || slot.isBooked) return false;

  slot.isBooked = true;

  const newAppt: Appointment = {
    id: `apt_${Date.now()}`,
    petId: pet.id,
    petName: pet.name,
    vetId: vet.id,
    vetName: vet.name,
    clinicName: vet.clinicName,
    reason: reason || 'General Checkup',
    date: day,
    time: time,
    status: 'confirmed'
  };

  appointments.unshift(newAppt);

  notifications.unshift({
    id: `notif_${Date.now()}`,
    type: 'appointment',
    title: 'Appointment Confirmed! 🩺',
    message: `Booked for ${pet.name} with ${vet.name} on ${day} at ${time}`,
    avatarUrl: vet.avatarUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return true;
}

export function createNewPost(caption: string, mediaUrl: string, asPetId?: string) {
  const selectedPet = asPetId ? pets.find(p => p.id === asPetId) : null;
  const newPost: Post = {
    id: `post_${Date.now()}`,
    ownerId: owner.id,
    ownerName: owner.isAnonymous ? 'Anonymous Pet Parent' : owner.displayName,
    ownerAvatar: owner.avatarUrl,
    petId: selectedPet?.id,
    petName: selectedPet?.name,
    petBreed: selectedPet?.breed,
    petAvatar: selectedPet?.avatarUrl,
    isAnonymous: owner.isAnonymous || (selectedPet?.isAnonymous ?? false),
    caption,
    mediaUrls: [mediaUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80'],
    likesCount: 1,
    commentsCount: 0,
    isLiked: true,
    isSaved: false,
    createdAt: 'Just now',
    hashtags: caption.match(/#[a-zA-Z0-9_]+/g)?.map(t => t.slice(1)) || ['pets'],
    comments: []
  };

  posts.unshift(newPost);
  if (selectedPet) {
    selectedPet.postsCount++;
  }
}

export function reportLostPet(data: Omit<LostFoundPost, 'id' | 'reportedAt' | 'isResolved'>) {
  const newAlert: LostFoundPost = {
    id: `lf_${Date.now()}`,
    ...data,
    reportedAt: 'Just now',
    isResolved: false
  };
  lostFoundList.unshift(newAlert);
  
  notifications.unshift({
    id: `notif_lost_${Date.now()}`,
    type: 'lost_alert',
    title: '🚨 Emergency Alert Created',
    message: `${data.petName} (${data.status.toUpperCase()}) broadcasted to nearby community`,
    avatarUrl: data.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

export function claimLostFoundPet(
  postId: string, 
  claimType: 'owner_reunited' | 'volunteer_rescue' | 'foster_care', 
  notes?: string
) {
  const item = lostFoundList.find(p => p.id === postId);
  if (!item) return;

  item.isClaimed = true;
  item.claimedBy = owner.displayName;
  item.claimedAt = 'Just now';
  item.claimType = claimType;
  item.claimNotes = notes || '';
  if (claimType === 'owner_reunited') {
    item.isResolved = true;
  }

  const title = claimType === 'owner_reunited'
    ? '🎉 Pet Reunited with Family!'
    : '🛡️ Rescue Dispatch Locked & Claimed';

  const message = claimType === 'owner_reunited'
    ? `${item.petName} has been claimed and safely reunited by their family!`
    : `${owner.displayName} has locked dispatch and claimed rescue coordination for ${item.petName}.`;

  notifications.unshift({
    id: `notif_claim_${Date.now()}`,
    type: 'lost_alert',
    title,
    message,
    avatarUrl: item.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

export function releaseLostFoundClaim(postId: string) {
  const item = lostFoundList.find(p => p.id === postId);
  if (!item) return;

  item.isClaimed = false;
  item.claimedBy = undefined;
  item.claimedAt = undefined;
  item.claimType = undefined;
  item.claimNotes = undefined;
  item.isResolved = false;
}

export function bookOrClaimAdoption(
  petId: string, 
  claimType: 'meet_greet' | 'adoption_hold' | 'foster_sponsor', 
  date: string = 'Tomorrow', 
  time: string = '2:00 PM'
) {
  const pet = adoptions.find(a => a.id === petId);
  if (!pet) return;

  pet.isClaimed = true;
  pet.claimedBy = owner.displayName;
  pet.claimedAt = 'Just now';
  pet.bookedMeetDate = date;
  pet.bookedMeetTime = time;
  pet.claimType = claimType;
  pet.status = 'pending';

  const title = claimType === 'meet_greet'
    ? '📅 Meet & Greet Confirmed!'
    : (claimType === 'adoption_hold' ? '🔒 48-Hour Adoption Hold Placed' : '🤝 Foster / Sponsorship Active');

  const message = claimType === 'meet_greet'
    ? `Meet & Greet booked for ${pet.name} with ${pet.shelterName} on ${date} at ${time}.`
    : `Adoption hold reserved for ${pet.name}. Shelter screening coordinator notified.`;

  notifications.unshift({
    id: `notif_adopt_${Date.now()}`,
    type: 'appointment',
    title,
    message,
    avatarUrl: pet.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  // Also add to appointments if it's a meet & greet
  if (claimType === 'meet_greet') {
    appointments.unshift({
      id: `apt_adopt_${Date.now()}`,
      petId: pet.id,
      petName: `${pet.name} (${pet.breed})`,
      vetId: 'shelter_1',
      vetName: `${pet.shelterName} Meet & Greet`,
      clinicName: pet.location,
      reason: `Adoption Meet & Greet for ${pet.name}`,
      date,
      time,
      status: 'confirmed'
    });
  }
}

export function cancelAdoptionClaim(petId: string) {
  const pet = adoptions.find(a => a.id === petId);
  if (!pet) return;

  pet.isClaimed = false;
  pet.claimedBy = undefined;
  pet.claimedAt = undefined;
  pet.bookedMeetDate = undefined;
  pet.bookedMeetTime = undefined;
  pet.claimType = undefined;
  pet.status = 'available';
}

export function markAllNotificationsAsRead() {
  notifications.forEach(n => n.isRead = true);
}

// Marketplace Store Actions
export function addMarketListing(data: Omit<MarketplaceListing, 'id' | 'status'>) {
  const newListing: MarketplaceListing = {
    id: `mkt_${Date.now()}`,
    status: 'available',
    ...data
  };

  marketplace.unshift(newListing);

  notifications.unshift({
    id: `notif_mkt_${Date.now()}`,
    type: 'ai_insight',
    title: '🛍️ Item Listed Successfully!',
    message: `Your listing "${newListing.title}" is now live on the Nuzzle Pet Marketplace.`,
    avatarUrl: newListing.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });

  return newListing;
}

export function verifyShopSubscription(shopName: string, category: string, feePlan: string = '$19.99/mo') {
  notifications.unshift({
    id: `notif_verify_${Date.now()}`,
    type: 'ai_insight',
    title: '🌟 Shop Verification Approved!',
    message: `Congratulations! "${shopName}" (${category}) is now an Official Nuzzle Verified Pet Shop with Gold Shield Status (${feePlan}).`,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    timeAgo: 'Just now',
    isRead: false
  });
}

export function buyMarketItem(itemId: string) {
  const item = marketplace.find(m => m.id === itemId);
  if (!item) return;

  notifications.unshift({
    id: `notif_buy_${Date.now()}`,
    type: 'ai_insight',
    title: '🛍️ Order Placed Successfully!',
    message: `Your order for "${item.title}" ($${item.price}) with ${item.sellerName} is confirmed! Tracking code dispatched.`,
    avatarUrl: item.imageUrl,
    timeAgo: 'Just now',
    isRead: false
  });
}

// Pro Member Subscription Actions (90 BDT / month)
export function subscribeToPro(plan: 'monthly' | 'annual' = 'monthly', method: string = 'bKash') {
  owner.isProMember = true;
  owner.proPlan = plan === 'monthly' ? '90 BDT / month' : '890 BDT / year';
  owner.proRenewalDate = 'Next Month';

  // Enable Pro on all pets
  pets.forEach(p => {
    p.isProMember = true;
  });

  notifications.unshift({
    id: `notif_pro_${Date.now()}`,
    type: 'ai_insight',
    title: '👑 Welcome to Nuzzle Pro!',
    message: `Subscription active via ${method} (${owner.proPlan}). All VIP privileges & PawDoctor AI unlocked!`,
    avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&auto=format&fit=crop&q=80',
    timeAgo: 'Just now',
    isRead: false
  });
}

export function cancelPro() {
  owner.isProMember = false;
  owner.proPlan = undefined;
  owner.proRenewalDate = undefined;
  pets.forEach(p => {
    p.isProMember = false;
  });
}


