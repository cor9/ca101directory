#!/usr/bin/env python3
"""
Script to fetch featured images from Child Actor 101 blog posts
using Open Graph meta tags
"""

import requests
from bs4 import BeautifulSoup
import json
import time

# Blog post URLs from the blog_posts.md file - All 18 posts
BLOG_POSTS = [
    # Headshots (3 posts)
    {
        "title": "Getting Multifaceted Shots from a 3-Look Headshot Session",
        "url": "https://www.childactor101.com/101-blog/getting-multifaceted-shots-from-a-3-look-headshot-session",
        "categories": ["Headshots"]
    },
    {
        "title": "Headshot Guide",
        "url": "https://www.childactor101.com/headshot-guide",
        "categories": ["Headshots"]
    },
    {
        "title": "Headshot Hacks: Mastering the No-Makeup Look",
        "url": "https://www.childactor101.com/101-blog/headshot-hacks-mastering-the-no-makeup-look-for-your-child-actor-essential-makeup-tips-for-perfect-photos",
        "categories": ["Headshots"]
    },
    
    # Self Tapes (3 posts)
    {
        "title": "Self Tape Guide",
        "url": "https://www.childactor101.com/101-blog/pvr68iuo938gsyb250tdh0m4wifk9o",
        "categories": ["Self Tapes"]
    },
    {
        "title": "Track Your Auditions and Expenses for Free",
        "url": "https://www.childactor101.com/101-blog/track-your-auditions-and-expenses-for-free",
        "categories": ["Self Tapes"]
    },
    {
        "title": "How to Help Your Child Actor Self-Tape Auditions While Traveling",
        "url": "https://www.childactor101.com/101-blog/how-to-help-your-child-actor-self-tape-auditions-while-traveling-a-parents-guide-to-taping-in-a-hotel-room",
        "categories": ["Self Tapes"]
    },
    
    # Training (3 posts)
    {
        "title": "When Should My Child Start Acting Training?",
        "url": "https://www.childactor101.com/101-blog/when-should-my-child-start-acting-training-a-parents-guide-to-the-right-age",
        "categories": ["Training"]
    },
    {
        "title": "The Harsh Truth: If You're Not Taking Training Seriously, Your Kid Is Just a Hobbyist",
        "url": "https://www.childactor101.com/101-blog/the-harsh-truth-if-youre-not-taking-training-seriously-your-kid-isnbspjust-a-hobbyist",
        "categories": ["Training"]
    },
    {
        "title": "The Screen Time That Counts: 8 Reasons Why Child Actors Need to Be Watching TV Shows",
        "url": "https://www.childactor101.com/101-blog/the-screen-time-that-counts-8-reasons-why-child-actors-need-to-be-watching-tv-shows",
        "categories": ["Training"]
    },
    
    # Getting Started (3 posts)
    {
        "title": "What It Takes",
        "url": "https://www.childactor101.com/101-blog/what-it-takes",
        "categories": ["Getting Started"]
    },
    {
        "title": "Is Your Child Ready for an Agent?",
        "url": "https://www.childactor101.com/101-blog/is-your-child-ready-for-an-agent-a-guide-for-parents-of-aspiring-young-actors",
        "categories": ["Getting Started"]
    },
    {
        "title": "The Critical Conversation",
        "url": "https://www.childactor101.com/101-blog/the-critical-conversation",
        "categories": ["Getting Started"]
    },
    
    # Talent Representation (3 posts)
    {
        "title": "Navigating Hollywood: Agent or Manager?",
        "url": "https://www.childactor101.com/101-blog/navigating-hollywood-do-you-need-a-talent-agent-or-a-manager",
        "categories": ["Talent Representation"]
    },
    {
        "title": "Hot Topic: Should You Be Your Child's Momager?",
        "url": "https://www.childactor101.com/101-blog/hot-topic-should-you-be-your-childs-momager",
        "categories": ["Talent Representation"]
    },
    {
        "title": "Ready to Wow Agents and Managers: Inside Tips to Ace Your Meeting",
        "url": "https://www.childactor101.com/101-blog/ready-to-wow-agents-and-managers-inside-tips-to-ace-your-meeting",
        "categories": ["Talent Representation"]
    },
    
    # Working Actor (3 posts)
    {
        "title": "On-Set Etiquette for Child Actors",
        "url": "https://www.childactor101.com/101-blog/on-set-etiquette-essential-guide-for-child-actors-and-their-parents",
        "categories": ["Working Actor"]
    },
    {
        "title": "A Rundown on Child Labor Laws",
        "url": "https://www.childactor101.com/101-blog/a-rundown-on-child-labor-laws-in",
        "categories": ["Working Actor"]
    },
    {
        "title": "Background Acting: The Pros and Cons for Young Performers",
        "url": "https://www.childactor101.com/101-blog/background-acting-the-pros-and-cons-for-young-performers",
        "categories": ["Working Actor"]
    }
]

def fetch_featured_image(post_url):
    """Fetch the featured image URL from a blog post's Open Graph meta tag"""
    try:
        print(f"Fetching: {post_url}")
        
        # Add headers to mimic a real browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(post_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse the HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the 'og:image' meta tag
        featured_image_tag = soup.find('meta', property='og:image')
        
        if featured_image_tag:
            image_url = featured_image_tag.get('content')
            print(f"✅ Found image: {image_url}")
            return image_url
        else:
            print("❌ Could not find og:image meta tag")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching {post_url}: {e}")
        return None
    except Exception as e:
        print(f"❌ Unexpected error for {post_url}: {e}")
        return None

def main():
    """Main function to fetch all blog post images"""
    print("🔍 Fetching featured images from Child Actor 101 blog posts...\n")
    
    results = []
    
    for i, post in enumerate(BLOG_POSTS, 1):
        print(f"[{i}/{len(BLOG_POSTS)}] {post['title']}")
        
        image_url = fetch_featured_image(post['url'])
        
        result = {
            "title": post['title'],
            "url": post['url'],
            "categories": post['categories'],
            "featuredImage": image_url
        }
        results.append(result)
        
        # Add a small delay to be respectful to the server
        time.sleep(1)
        print()
    
    # Print results in a format that can be easily copied to the React component
    print("=" * 80)
    print("RESULTS - Copy this to your React component:")
    print("=" * 80)
    
    for result in results:
        print(f"  {{")
        print(f"    title: \"{result['title']}\",")
        print(f"    link: \"{result['url']}\",")
        print(f"    description: \"\", // Add description manually")
        print(f"    pubDate: \"\", // Add date manually")
        print(f"    categories: {result['categories']},")
        if result['featuredImage']:
            print(f"    featuredImage: \"{result['featuredImage']}\",")
        else:
            print(f"    featuredImage: \"\", // No image found")
        print(f"  }},")
        print()
    
    # Save results to JSON file
    with open('blog_images.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"📁 Results also saved to blog_images.json")
    print(f"✅ Processed {len(results)} blog posts")

if __name__ == "__main__":
    main()
