export type BookContent = {
  title: string;
  author?: string; // Add author field
  coverUrl?: string; // Add optional cover URL
  pages: string[];
};

export const bookContent: Record<string, BookContent> = {
  // Expanded mock content for common OpenLibrary books
  "OL24209966W": { // Dracula
    title: "Dracula (Preview)",
    author: "Bram Stoker",
    coverUrl: "https://covers.openlibrary.org/b/id/12726462-M.jpg", // Add actual cover URL
    pages: [
      "📚 READER BETA - PREVIEW ONLY 📚\n\nThis is a demonstration of the Personal Librarian reader functionality. The content shown here is not the actual complete text of Dracula by Bram Stoker.\n\nTo read the full book, please visit your local library or a digital library service.",
      
      "DRACULA\nby Bram Stoker\n\nCHAPTER I\nJONATHAN HARKER'S JOURNAL",
      
      "3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets. I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible.",
      
      "The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.",
      
      "We left in pretty good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but thirsty. (Mem. get recipe for Mina.) I asked the waiter, and he said it was called 'paprika hendl,' and that, as it was a national dish, I should be able to get it anywhere along the Carpathians.",
      
      "I found my smattering of German very useful here, indeed, I don't know how I should be able to get on without it.",
      
      "Having had some time at my disposal when in London, I had visited the British Museum, and made search among the books and maps in the library regarding Transylvania; it had struck me that some foreknowledge of the country could hardly fail to have some importance in dealing with a nobleman of that country.",
      
      "I find that the district he named is in the extreme east of the country, just on the borders of three states, Transylvania, Moldavia and Bukovina, in the midst of the Carpathian mountains; one of the wildest and least known portions of Europe. I was not able to light on any map or work giving the exact locality of the Castle Dracula, as there are no maps of this country as yet to compare with our own Ordnance Survey maps; but I found that Bistritz, the post town named by Count Dracula, is a fairly well-known place.",
      
      "I shall enter here some of my notes, as they may refresh my memory when I talk over my travels with Mina.",
      
      "4 May.—I found that my landlord had got a letter from the Count, directing him to secure the best place on the coach for me; but on making inquiries as to details he seemed somewhat reticent, and pretended that he could not understand my German.",
      
      "This could not be true, because up to then he had understood it perfectly; at least, he answered my questions exactly as if he did. He and his wife, the old lady who had received me, looked at each other in a frightened sort of way. He mumbled out that the money had been sent in a letter, and that was all he knew. When I asked him if he knew Count Dracula, and could tell me anything of his castle, both he and his wife crossed themselves, and, saying that they knew nothing at all, simply refused to speak further.",
      
      "It was so near the time of starting that I had no time to ask any one else, for it was all very mysterious and not by any means comforting.",
      
      "Just before I was leaving, the old lady came up to my room and said in a very hysterical way:",
      
      "\"Must you go? Oh! young Herr, must you go?\" She was in such an excited state that she seemed to have lost her grip of what German she knew, and mixed it all up with some other language which I did not know at all. I was just able to follow her by asking many questions.",
      
      "When I told her that I must go at once, and that I was engaged on important business, she asked again:",
      
      "\"Do you know what day it is?\" I answered that it was the fourth of May. She shook her head as she said again:",
      
      "\"Oh, yes! I know that, I know that! but do you know what day it is?\" On my saying that I did not understand, she went on:",
      
      "\"It is the eve of St. George's Day. Do you not know that to-night, when the clock strikes midnight, all the evil things in the world will have full sway? Do you know where you are going, and what you are going to?\" She was in such evident distress that I tried to comfort her, but without effect. Finally she went down on her knees and implored me not to go; at least to wait a day or two before starting.",
      
      "CHAPTER II\nJONATHAN HARKER'S JOURNAL—continued",
      
      "5 May.—The Castle. The gray of the morning has passed, and the sun is high over the distant horizon, which seems jagged, whether with trees or hills I know not, for it is so far off that big things and little are mixed. I am not sleepy, and, as I am not to be called till I awake, naturally I write till sleep comes. There are many odd things to put down, and, lest who reads them may fancy that I dined too well before I left Bistritz, let me put down my dinner exactly.",
      
      "[PREVIEW ENDS HERE - This is a sample of the book for demonstration purposes only]"
    ]
  },
  
  "OL1394592W": { // Pride and Prejudice
    title: "Pride and Prejudice (Preview)",
    author: "Jane Austen",
    coverUrl: "https://covers.openlibrary.org/b/id/12645178-M.jpg", // Add actual cover URL
    pages: [
      "📚 READER BETA - PREVIEW ONLY 📚\n\nThis is a demonstration of the Personal Librarian reader functionality. The content shown here is not the actual complete text of Pride and Prejudice by Jane Austen.\n\nTo read the full book, please visit your local library or a digital library service.",
      
      "PRIDE AND PREJUDICE\nby Jane Austen\n\nCHAPTER 1",
      
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      
      "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
      
      "\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"",
      
      "Mr. Bennet replied that he had not.",
      
      "\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"",
      
      "Mr. Bennet made no answer.",
      
      "\"Do you not want to know who has taken it?\" cried his wife impatiently.",
      
      "\"You want to tell me, and I have no objection to hearing it.\"",
      
      "This was invitation enough.",
      
      "\"Why, my dear, you must know, Mrs. Long says that Netherfield is taken by a young man of large fortune from the north of England; that he came down on Monday in a chaise and four to see the place, and was so much delighted with it, that he agreed with Mr. Morris immediately; that he is to take possession before Michaelmas, and some of his servants are to be in the house by the end of next week.\"",
      
      "\"What is his name?\"",
      
      "\"Bingley.\"",
      
      "\"Is he married or single?\"",
      
      "\"Oh! Single, my dear, to be sure! A single man of large fortune; four or five thousand a year. What a fine thing for our girls!\"",
      
      "\"How so? How can it affect them?\"",
      
      "\"My dear Mr. Bennet,\" replied his wife, \"how can you be so tiresome! You must know that I am thinking of his marrying one of them.\"",
      
      "\"Is that his design in settling here?\"",
      
      "\"Design! Nonsense, how can you talk so! But it is very likely that he may fall in love with one of them, and therefore you must visit him as soon as he comes.\"",
      
      "CHAPTER 2",
      
      "Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner. Observing his second daughter employed in trimming a hat, he suddenly addressed her with:",
      
      "[PREVIEW ENDS HERE - This is a sample of the book for demonstration purposes only]"
    ]
  },
  
  "OL8974098W": { // Frankenstein
    title: "Frankenstein (Preview)",
    author: "Mary Shelley",
    coverUrl: "https://covers.openlibrary.org/b/id/6788472-M.jpg", // Add actual cover URL
    pages: [
      "📚 READER BETA - PREVIEW ONLY 📚\n\nThis is a demonstration of the Personal Librarian reader functionality. The content shown here is not the actual complete text of Frankenstein by Mary Shelley.\n\nTo read the full book, please visit your local library or a digital library service.",
      
      "FRANKENSTEIN; OR, THE MODERN PROMETHEUS\nby Mary Shelley\n\nLetter 1",
      
      "TO Mrs. Saville, England.",
      
      "St. Petersburgh, Dec. 11th, 17—.",
      
      "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
      
      "I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.",
      
      "Inspirited by this wind of promise, my daydreams become more fervent and vivid. I try in vain to be persuaded that the pole is the seat of frost and desolation; it ever presents itself to my imagination as the region of beauty and delight. There, Margaret, the sun is forever visible, its broad disk just skirting the horizon and diffusing a perpetual splendour.",
      
      "There—for with your leave, my sister, I will put some trust in preceding navigators—there snow and frost are banished; and, sailing over a calm sea, we may be wafted to a land surpassing in wonders and in beauty every region hitherto discovered on the habitable globe.",
      
      "Its productions and features may be without example, as the phenomena of the heavenly bodies undoubtedly are in those undiscovered solitudes. What may not be expected in a country of eternal light? I may there discover the wondrous power which attracts the needle and may regulate a thousand celestial observations that require only this voyage to render their seeming eccentricities consistent forever.",
      
      "I shall satiate my ardent curiosity with the sight of a part of the world never before visited, and may tread a land never before imprinted by the foot of man. These are my enticements, and they are sufficient to conquer all fear of danger or death and to induce me to commence this laborious voyage with the joy a child feels when he embarks in a little boat, with his holiday mates, on an expedition of discovery up his native river.",
      
      "But supposing all these conjectures to be false, you cannot contest the inestimable benefit which I shall confer on all mankind, to the last generation, by discovering a passage near the pole to those countries, to reach which at present so many months are requisite; or by ascertaining the secret of the magnet, which, if at all possible, can only be effected by an undertaking such as mine.",
      
      "Letter 2",
      
      "TO Mrs. Saville, England.",
      
      "Archangel, 28th March, 17—.",
      
      "How slowly the time passes here, encompassed as I am by frost and snow! Yet a second step is taken towards my enterprise. I have hired a vessel and am occupied in collecting my sailors; those whom I have already engaged appear to be men on whom I can depend and are certainly possessed of dauntless courage.",
      
      "But I have one want which I have never yet been able to satisfy, and the absence of the object of which I now feel as a most severe evil. I have no friend, Margaret: when I am glowing with the enthusiasm of success, there will be none to participate my joy; if I am assailed by disappointment, no one will endeavour to sustain me in dejection.",
      
      "I shall commit my thoughts to paper, it is true; but that is a poor medium for the communication of feeling. I desire the company of a man who could sympathize with me, whose eyes would reply to mine. You may deem me romantic, my dear sister, but I bitterly feel the want of a friend. I have no one near me, gentle yet courageous, possessed of a cultivated as well as of a capacious mind, whose tastes are like my own, to approve or amend my plans.",
      
      "[PREVIEW ENDS HERE - This is a sample of the book for demonstration purposes only]"
    ]
  }
};