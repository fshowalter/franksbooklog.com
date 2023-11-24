export const data = {
  update: {
    nodes: [
      {
        grade: "A",
        sequence: 57,
        slug: "record-play-pause-by-stephen-morris",
        date: "11 Nov 2023",
        review: {
          excerpt: "",
        },
        title: "Record Play Pause",
        kind: "Nonfiction",
        yearPublished: "2019",
        authors: [
          {
            name: "Stephen Morris",
            slug: "stephen-morris",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/e68b702981d064e0b7c9e176520e6b96/4ed50/record-play-pause-by-stephen-morris.jpg",
                  srcSet:
                    "/static/e68b702981d064e0b7c9e176520e6b96/4ed50/record-play-pause-by-stephen-morris.jpg 168w,\n/static/e68b702981d064e0b7c9e176520e6b96/9a248/record-play-pause-by-stephen-morris.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/e68b702981d064e0b7c9e176520e6b96/5ae08/record-play-pause-by-stephen-morris.avif 168w,\n/static/e68b702981d064e0b7c9e176520e6b96/0d95f/record-play-pause-by-stephen-morris.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "B-",
        sequence: 56,
        slug: "fright-night-origins-by-tom-holland-a-jack-ulrich",
        date: "06 Nov 2023",
        review: {
          excerpt: "",
        },
        title: "Fright Night Origins",
        kind: "Novel",
        yearPublished: "2023",
        authors: [
          {
            name: "Tom Holland",
            slug: "tom-holland",
            notes: null,
          },
          {
            name: "A. Jack Ulrich",
            slug: "a-jack-ulrich",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/2c632dcc2ba20e50c51a7bf5e8b0314d/4ed50/fright-night-origins-by-tom-holland-a-jack-ulrich.jpg",
                  srcSet:
                    "/static/2c632dcc2ba20e50c51a7bf5e8b0314d/4ed50/fright-night-origins-by-tom-holland-a-jack-ulrich.jpg 168w,\n/static/2c632dcc2ba20e50c51a7bf5e8b0314d/9a248/fright-night-origins-by-tom-holland-a-jack-ulrich.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/2c632dcc2ba20e50c51a7bf5e8b0314d/5ae08/fright-night-origins-by-tom-holland-a-jack-ulrich.avif 168w,\n/static/2c632dcc2ba20e50c51a7bf5e8b0314d/0d95f/fright-night-origins-by-tom-holland-a-jack-ulrich.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "C-",
        sequence: 55,
        slug: "dont-let-them-get-you-down-by-philip-fracassi",
        date: "29 Oct 2023",
        review: {
          excerpt: "",
        },
        title: "Don't Let Them Get You Down",
        kind: "Novel",
        yearPublished: "2022",
        authors: [
          {
            name: "Philip Fracassi",
            slug: "philip-fracassi",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/920b3652a167c269ad8e3d59866a5097/4ed50/dont-let-them-get-you-down-by-philip-fracassi.jpg",
                  srcSet:
                    "/static/920b3652a167c269ad8e3d59866a5097/4ed50/dont-let-them-get-you-down-by-philip-fracassi.jpg 168w,\n/static/920b3652a167c269ad8e3d59866a5097/9a248/dont-let-them-get-you-down-by-philip-fracassi.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/920b3652a167c269ad8e3d59866a5097/5ae08/dont-let-them-get-you-down-by-philip-fracassi.avif 168w,\n/static/920b3652a167c269ad8e3d59866a5097/0d95f/dont-let-them-get-you-down-by-philip-fracassi.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "C+",
        sequence: 54,
        slug: "the-creative-act-by-rick-rubin",
        date: "22 Oct 2023",
        review: {
          excerpt: "",
        },
        title: "The Creative Act",
        kind: "Nonfiction",
        yearPublished: "2023",
        authors: [
          {
            name: "Rick Rubin",
            slug: "rick-rubin",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAeCAYAAAAsEj5rAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFu0lEQVR42lWWa28UdRTG9xOY6JcwBuMbNRqNEghgA4gFREKMb700CoVwUcFAsRcoAqFg6b3c2lKbFiz03u1eZ3Z2di67M7ttty2Q+EUen3NmLfjiZLrtzm+e85znf6Yxt2TDLeZguRlk8gmkLaklrRQra6dgFtLIORnkPUPL5HctL4u8b8AopJDzMkjbCSxk5xDzg5dAgzcbdhJZgqUyltSS/u5VqE2QRYiA7KKB4fEHGJ8aQ9KKI+YW8yjIFwjMyU2FCGrko8paEViuETip3ykQNP5kFAPDfbhwuQldd7tgemkCS3nY0oqbjaBOGqYqjcBmTbEojSpOGxL8XgpJcwGL6Rn0P+jByMR9GG4KMY/AAoFStlZ2E5pVGCtHT3NxpMxFXqMy8ktsP00Pl3Dvr0HcHR2IgH4oHlpwSxYceil+ClzayuQiLy0+IBoaB2XMI5mdJ3yBNsSpcBqDI/3oHLgFg6pjxXKBsBwc33wJI0A8ClYcDiCD6YVJjE+OYj4xRb+z8MKcAkXp4HAvrnVeZdu9ETBc9lCkSi+w4FGlTS8rVQ8zi09w7PRx1O3bi7rP92BP/V7sqNuJXbs/w8+/nUaCEbHcNMHzmzYkWZtAP8hr28tVH61X27B1104cJ3B47D4WEtNIG4tU+je6+m5i/6F6vPvB++i9c1s7iGdm1eOkydiUV4oIl10qzKO6EeKXC2ex98sDiKdmsPY8RMi25WGFokmPTRTLeZSrLjp7OvDmlrfQcfu6Qpcyc0hwaAoUhWvPQnQN3Ma+Qwf5Oa8PkfbFWylNgUSLWc0yPvKgO0N92PLO25hgHiWrSQFWqiX+0VMP6w8fwtPZx1hdL2n7oixKAYfmmRop8S3PEyMWlFddnDxzAge+OqAdLHH6VOhj/XmFfnSj8fQJrD8r69T9mq/yIImT/CxAhTIFeooYqUVa88m2TzE6MaS51ZZf/LOKs03n0DPYjY0XlU1lPlvXYfHpKWNBH2RRnZTkNMUhePR0PxW2tjejEFqRwtWNAL+eP4eJyTEOJkCJ2ZSSUyRTbzj6A157/Q10dncgWC4oTFTKUfQJ/P7H79B4qhF2kKOHVCjTvdjWjMnpR/SvBqw4OvmVtSKOfHMEsVgMbVea6ZuHnJ1SlbIw/IqNhmMNOHryKNXakkNf2/yj4xrGHo3Sz7LCyhxUwEkLQIYw/nhU/dQBydRlFxJcWnZw+OvDaG7/HR7h2nKVkRkZG8at7k6NjyiU34crLgLCg4pLpSW1wPFzmkdZJFHbCWzftR0j3ImydGPL1YA+FbW9ptYW3TJys6gLayUPkKxKSZyk5HuV9SIuXW3FFwfr4XAgmzkUBaJsZPwhLt+4zuiEPM++ti5AgcvPOqggWndixezSFN77+EM8HB9SdfLaiK2sBais+upZlQPp7O/Fze4uBVU3IqWykaIY2WqB+Dw1P4mPtm1Fy5UW9VEilOX0XwH6qLBW2P7dh0NovXadK2uCm9z4n7r5xAwutF7Ejt11uNl1AyFPi1GobXgBVlapojbRsNaa5HIhtYCO3m5cvNKOpvZLON/WgsYzp/DtTw16CBZTs4R56mWOy9ckzGQaYuXVIv2gXwKr+SUtikfLzKDlZLl55rm6nhIyx7iYWOFZ93iK5D0kn+VtmOF7xuDUN4ECEqVhTW2RSgUcZTHyWDqIVlmOK8tUmMfpxjPz6HvQTw8JDJYF5ilApl2qwaR1ufohI1OOTo1Ti4yUvJtFocvfL6bn0HO/V/8BoEKZpLRMZRyKqJSpCURgrm7y/8qqfbZUobTqcGEo8F4Ph5KRoYQKK1U8Vapqy6LO3VTmSaDlPwxdZ1G4pW3Jns1TM5ecwZ9czlkBllcC3khvyq5CpYqvXD1VGQGdUgQvEJgXhWxZKmHEMclcZuyMLIcSYXIj3yuEytUJHbgsJyjwZluvLsspRWCb73HTNbTFjJ3WEnVpO4N/AZOujz9sgu7/AAAAAElFTkSuQmCC",
              },
              images: {
                fallback: {
                  src: "/static/385e5cca201130cfef029d4b6ae0b19b/4ed50/the-creative-act-by-rick-rubin.jpg",
                  srcSet:
                    "/static/385e5cca201130cfef029d4b6ae0b19b/4ed50/the-creative-act-by-rick-rubin.jpg 168w,\n/static/385e5cca201130cfef029d4b6ae0b19b/9a248/the-creative-act-by-rick-rubin.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/385e5cca201130cfef029d4b6ae0b19b/5ae08/the-creative-act-by-rick-rubin.avif 168w,\n/static/385e5cca201130cfef029d4b6ae0b19b/0d95f/the-creative-act-by-rick-rubin.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "B",
        sequence: 53,
        slug: "sacculina-by-philip-fracassi",
        date: "09 Oct 2023",
        review: {
          excerpt:
            "To celebrate Jim’s older brother Jack’s release following a six-year prison stint, the brothers, their father Henry, and Jack’s hulking best friend Chris, charter a fishing boat in the Pacific. The choppy seas don’t bode well for an outing, but the group presses ahead, and their grizzled captain takes them a few miles offshore to a deep spot good for fishing. But the men soon realize they’re under threat by an unknown, overwhelming assailant—and how alone they are at sea.",
        },
        title: "Sacculina",
        kind: "Novella",
        yearPublished: "2017",
        authors: [
          {
            name: "Philip Fracassi",
            slug: "philip-fracassi",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/d181a9dbb80e25c61e35148cd0cca1e7/4ed50/sacculina-by-philip-fracassi.jpg",
                  srcSet:
                    "/static/d181a9dbb80e25c61e35148cd0cca1e7/4ed50/sacculina-by-philip-fracassi.jpg 168w,\n/static/d181a9dbb80e25c61e35148cd0cca1e7/9a248/sacculina-by-philip-fracassi.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/d181a9dbb80e25c61e35148cd0cca1e7/5ae08/sacculina-by-philip-fracassi.avif 168w,\n/static/d181a9dbb80e25c61e35148cd0cca1e7/0d95f/sacculina-by-philip-fracassi.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "B",
        sequence: 52,
        slug: "the-cipher-by-kathe-koja",
        date: "29 Jan 2023",
        review: {
          excerpt:
            "How to describe The Cipher? The plot concerns Nicholas, an aimless twenty-something drifting through life, who discovers a mysterious hole inside a disused storage room in his derelict apartment building. Weird things ensue.",
        },
        title: "The Cipher",
        kind: "Novel",
        yearPublished: "1991",
        authors: [
          {
            name: "Kathe Koja",
            slug: "kathe-koja",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/ea73e1deb9739060084af4a0057bb69d/4ed50/the-cipher-by-kathe-koja.jpg",
                  srcSet:
                    "/static/ea73e1deb9739060084af4a0057bb69d/4ed50/the-cipher-by-kathe-koja.jpg 168w,\n/static/ea73e1deb9739060084af4a0057bb69d/9a248/the-cipher-by-kathe-koja.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/ea73e1deb9739060084af4a0057bb69d/5ae08/the-cipher-by-kathe-koja.avif 168w,\n/static/ea73e1deb9739060084af4a0057bb69d/0d95f/the-cipher-by-kathe-koja.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "C-",
        sequence: 51,
        slug: "roadside-pickup-by-richard-laymon",
        date: "21 Jan 2023",
        review: {
          excerpt:
            "Early morning darkness. Colleen sits stranded in her car. Three hours have produced three cars. None have stopped. But the fourth does. A…",
        },
        title: "Roadside Pickup",
        kind: "Short Story",
        yearPublished: "1974",
        authors: [
          {
            name: "Richard Laymon",
            slug: "richard-laymon",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/8acae41db8fa464249340b17cc680c45/4ed50/short-stories-volume-one-by-richard-laymon.jpg",
                  srcSet:
                    "/static/8acae41db8fa464249340b17cc680c45/4ed50/short-stories-volume-one-by-richard-laymon.jpg 168w,\n/static/8acae41db8fa464249340b17cc680c45/9a248/short-stories-volume-one-by-richard-laymon.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/8acae41db8fa464249340b17cc680c45/5ae08/short-stories-volume-one-by-richard-laymon.avif 168w,\n/static/8acae41db8fa464249340b17cc680c45/0d95f/short-stories-volume-one-by-richard-laymon.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "F",
        sequence: 50,
        slug: "fright-night-by-john-skipp-craig-spector",
        date: "21 Jan 2023",
        review: {
          excerpt:
            "During a late-night make-out session with his girlfriend, high-schooler Charlie Brewster spies two men carrying a coffin into the basement of the house next-door. Charlie soon discovers his suave new neighbor, Jerry Dandrige, has fangs. When the police don’t believe him, Charlie appeals to the local creature-feature host, washed up horror icon Peter Vincent, for help.",
        },
        title: "Fright Night",
        kind: "Novel",
        yearPublished: "1985",
        authors: [
          {
            name: "John Skipp",
            slug: "john-skipp",
            notes: null,
          },
          {
            name: "Craig Spector",
            slug: "craig-spector",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/ed5b9db089419d3103835aec289aa0b7/4ed50/fright-night-by-john-skipp-craig-spector.jpg",
                  srcSet:
                    "/static/ed5b9db089419d3103835aec289aa0b7/4ed50/fright-night-by-john-skipp-craig-spector.jpg 168w,\n/static/ed5b9db089419d3103835aec289aa0b7/9a248/fright-night-by-john-skipp-craig-spector.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/ed5b9db089419d3103835aec289aa0b7/5ae08/fright-night-by-john-skipp-craig-spector.avif 168w,\n/static/ed5b9db089419d3103835aec289aa0b7/0d95f/fright-night-by-john-skipp-craig-spector.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "C+",
        sequence: 49,
        slug: "doctor-sleep-by-stephen-king",
        date: "14 Jan 2023",
        review: {
          excerpt:
            "Stephen King’s sequel to The Shining finds Dan Torrance a middle-aged recovering alcoholic living in New Hampshire and working as a hospice orderly. He uses his unique gifts to comfort residents as they transition to the other side.",
        },
        title: "Doctor Sleep",
        kind: "Novel",
        yearPublished: "2013",
        authors: [
          {
            name: "Stephen King",
            slug: "stephen-king",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/2ade3db6dd7bc3e5e33473384ec0baf0/4ed50/doctor-sleep-by-stephen-king.jpg",
                  srcSet:
                    "/static/2ade3db6dd7bc3e5e33473384ec0baf0/4ed50/doctor-sleep-by-stephen-king.jpg 168w,\n/static/2ade3db6dd7bc3e5e33473384ec0baf0/9a248/doctor-sleep-by-stephen-king.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/2ade3db6dd7bc3e5e33473384ec0baf0/5ae08/doctor-sleep-by-stephen-king.avif 168w,\n/static/2ade3db6dd7bc3e5e33473384ec0baf0/0d95f/doctor-sleep-by-stephen-king.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
      {
        grade: "B+",
        sequence: 48,
        slug: "the-skeptics-guide-to-the-universe-by-steven-novella",
        date: "29 Oct 2022",
        review: {
          excerpt:
            "A practical guide to critical thinking in the information age. Novella and his colleagues illuminate cognitive biases and logical fallacies with understandable examples. They then apply them to assorted topics, including ghosts, extrasensory perception, assorted conspiracy theories, and global warming.",
        },
        title: "The Skeptics' Guide to the Universe",
        kind: "Nonfiction",
        yearPublished: "2018",
        authors: [
          {
            name: "Steven Novella",
            slug: "steven-novella",
            notes: null,
          },
        ],
        cover: {
          childImageSharp: {
            gatsbyImageData: {
              layout: "fixed" as const,
              placeholder: {
                fallback:
                  "data:image/png;base64,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",
              },
              images: {
                fallback: {
                  src: "/static/d1c88412dd7d2f24f26ab4ce5f5360a4/4ed50/the-skeptics-guide-to-the-universe-by-steven-novella.jpg",
                  srcSet:
                    "/static/d1c88412dd7d2f24f26ab4ce5f5360a4/4ed50/the-skeptics-guide-to-the-universe-by-steven-novella.jpg 168w,\n/static/d1c88412dd7d2f24f26ab4ce5f5360a4/9a248/the-skeptics-guide-to-the-universe-by-steven-novella.jpg 336w",
                  sizes: "168px",
                },
                sources: [
                  {
                    srcSet:
                      "/static/d1c88412dd7d2f24f26ab4ce5f5360a4/5ae08/the-skeptics-guide-to-the-universe-by-steven-novella.avif 168w,\n/static/d1c88412dd7d2f24f26ab4ce5f5360a4/0d95f/the-skeptics-guide-to-the-universe-by-steven-novella.avif 336w",
                    type: "image/avif",
                    sizes: "168px",
                  },
                ],
              },
              width: 168,
              height: 252,
            },
          },
        },
      },
    ],
  },
};
