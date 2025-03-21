 
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


export default function animationSetup() {

  let indicator = document.querySelector('.featured-perk > .indicator');
  let line = indicator.querySelector('.line');
  let indicatorNum = indicator.querySelector('.number');

  //  Hero Chat Bubbles Animation 
  var entranceAnimation = new gsap.timeline({onComplete: function() {
    chatAnimation("start");
  }
});

    entranceAnimation.from(".avatar", {
        duration: 1,
        scale: 0,
        transformOrigin:"center",
        y: 40,
        ease: "power1.inOut",
        stagger: {
          grid: [7,20],
          from: "center",
          amount: 1.2
        }
      });

    // image Reveals
    let featured = document.querySelector('.featured-perk');
    reveal(featured);
}

 function chatAnimation(side) {
    let currentSide = document.querySelector(`.image-group[data-side=${side}]`);
    let avatars = currentSide.querySelectorAll('.avatar__frame');
    let next;
    side == "start" ? next = "end" : next = "start";
  
   let randomAvatar = avatars[randomIntFromInterval(0, avatars.length - 1)];
    requestAnimationFrame(() => {
      applyAnimation(randomAvatar, next)
    });
    }

    function applyAnimation(target, next) {
        const frame = target.querySelector('.avatar');
        const el = target.querySelector('.speech');
        const ripple = target.querySelector('.ripple');
        const isStart = next == "end" ? true : false;
        const timelineDelay = 500;
        const targetScale = isStart
          ? { scaleX: -0.8, scaleY: 0.85 }
          : { scaleX: 0.8, scaleY: 0.85 };

        var tl = new gsap.timeline({
          invalidateOnRefresh: true,
          onComplete: function () {
            setTimeout(() => {
              requestAnimationFrame(() => {
                chatAnimation(next);
              })
            },timelineDelay)
          },
        });


        window.addEventListener('resize', centerRipple(target, ripple, tl));
        centerRipple(target, ripple, tl);

        tl.fromTo(
          ripple,
          {
            scale: 1.15,
            opacity: 0, 
            rotation: 0 
          },
          {
            scale: 1.35,
            opacity: 1, 
            duration: 0.30, 
            ease: "expo.out", 
            repeat: 3, 
            yoyo: true 
          },
          "start" 
        )
        .to(
          ripple,
          {
            scale: 1.15,
            opacity: 0, 
            duration: 0.5, 
            ease: "power1.out" 
          }
        );

  
        // Grow Avatar Animation
        tl.to(frame, {
          scale: 1.1,
          duration: 0.8, 
          yoyo: true,
          ease: "expo.out"
        }, "start").to(frame, {
          scale: 1,
          ease: "power1.out"
        }, "start+=1.2")

        
        // Frame Animation (Image Pulse + Fade)
        tl.fromTo(
          frame,
          {
            opacity: 0.55,
            filter: "grayscale(0.4)",
            ease: "power1.inOut",
          },
          {
            opacity: 1,
            filter: "grayscale(0)",
            duration: 1,
            ease: "power1.inOut",
          },
          "start"
        ).to(
          frame,
          {
            opacity: 0.55,
            filter: "grayscale(0.4)",
            duration: 1,
            ease: "power1.inOut",
            delay: 0.75
          },
          "start+=3.2" 
        );
        
        // Speech Bubble Animation
        
        // Entry Animation for Speech Bubble
        tl.fromTo(
          el,
          {
            scaleX: targetScale.scaleX * 0.5, 
            scaleY: targetScale.scaleY * 0.5,
            opacity: 0, 
          },
          {
            scaleX: targetScale.scaleX, 
            scaleY: targetScale.scaleY,
            x: isStart ? "20%" : "-20%",
            y: isStart ? "-50%" : "-50%",
            opacity: 1, 
            duration: 1.3,
            ease: "elastic.out"
          },
          "start+=1.42"
        );
        
        
        tl.to(
          el,
          {
            scaleX: targetScale.scaleX * 0.5, 
            scaleY: targetScale.scaleY * 0.5,
            x: isStart ? "20%" : "-20%",
            y: isStart ? "-40%" : "-40%",
            opacity: 0, 
            duration: 0.8,
            ease: "power1.inOut",
            delay: 0.75
          },
          "start+=3.2"
        );


      } 



      function centerRipple(target, ripple, tl) {
        let rect = target.getBoundingClientRect();
        ripple.style.top = `${rect.height / 2}px`;
        ripple.style.left = `${rect.width / 2}px`;
        
        tl.set(ripple, {
          x: "-50%",
          y: "-50%",
        });
      }

      function randomIntFromInterval(min, max) { 
        return Math.floor(Math.random() * (max - min + 1) + min);
        }


      export function reveal(section) {

        let indicatorBorder = section.querySelector('.indicator > svg > circle');
        let indicator = section.querySelector('.indicator > .line');
        let images = section.querySelectorAll('.grid[data-reveal="true"] > img');
        let text = section.querySelectorAll('.stack-small > *');


        let tl = gsap.timeline(
          {
          scrollTrigger: {
            trigger: section,
            pin: false,
            start: "200px center",
            end: "700px",
            ease: "power1.inOut",
            once: true
          }
        }
      );

      tl.addLabel("start").to(indicator, {
          scaleY: 1,
          transformOrigin: "top"
        }).to(indicatorBorder, {
          strokeDashoffset: 0,
        }).to('.number', {
          opacity: 1,
          duration: 1,
          ease: "power3.inOut"
        }).to(images, {
        opacity: 1,
        duration: 0.55,
        ease: "circ.in",
        ease: "power1.in",
        "--clip": "0% 0%, 0% 100%, 100% 100%, 100% 0%",
        stagger: 0.103125
      }, "-=0.76").to(text, {
        opacity: 1,
        stagger: 0.2,
        ease: "power1.inOut",
        y:0,
      }, "-=0.04");


      let imageHover = gsap.to([], { 
        paused: true
      });
      
      images.forEach(image => {
        image.addEventListener("mouseenter", () => {
          imageHover.vars.targets = image;
          imageHover.play();
        });
      
        image.addEventListener("mouseleave", () => imageHover.reverse());
      });
      }

      
  