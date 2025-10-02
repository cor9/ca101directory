#!/usr/bin/env python3
"""
Script to fetch featured images from Child Actor 101 blog posts
using Open Graph meta tags
"""

import requests
from bs4 import BeautifulSoup
import json
import time

# Blog post URLs from the blog_posts.md file
BLOG_POSTS = [
    {
        "title": "Getting Multifaceted Shots from a 3-Look Headshot Session",
        "url": "https://www.childactor101.com/101-blog/getting-multifaceted-shots-from-a-3-look-headshot-session",
        "categories": ["Headshots"]
    },
    {
        "title": "Track Your Auditions and Expenses for Free",
        "url": "https://www.childactor101.com/101-blog/track-your-auditions-and-expenses-for-free",
        "categories": ["Self Tapes", "Getting Started"]
    },
    {
        "title": "When Should My Child Start Acting Training?",
        "url": "https://www.childactor101.com/101-blog/when-should-my-child-start-acting-training-a-parents-guide-to-the-right-age",
        "categories": ["Training", "Getting Started"]
    },
    {
        "title": "Navigating Hollywood: Agent or Manager?",
        "url": "https://www.childactor101.com/101-blog/navigating-hollywood-do-you-need-a-talent-agent-or-a-manager",
        "categories": ["Talent Representation"]
    },
    {
        "title": "On-Set Etiquette for Child Actors",
        "url": "https://www.childactor101.com/101-blog/on-set-etiquette-essential-guide-for-child-actors-and-their-parents",
        "categories": ["Working Actor"]
    },
    {
        "title": "Headshot Hacks: Mastering the No-Makeup Look",
        "url": "https://www.childactor101.com/101-blog/headshot-hacks-mastering-the-no-makeup-look-for-your-child-actor-essential-makeup-tips-for-perfect-photos",
        "categories": ["Headshots"]
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
