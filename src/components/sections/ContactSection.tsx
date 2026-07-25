"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WHATSAPP_LINK = "https://wa.me/919875432441?text=Hi%20Calcutta%20Backpackers!%20I'm%20interested%20in%20booking%20a%20stay.";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-40 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="label-upper text-waabi-green-dark block mb-4"
        >
          Get In Touch
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="heading-xl font-serif text-dark mb-16 md:mb-24"
        >
          Ready to <span className="italic text-waabi-green-dark">book smart?</span>
        </motion.h2>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Big CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 relative h-[400px] md:h-[450px] waabi-card group"
          >
            <Image
              src="/images/Community.webp"
              alt="Book your stay"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-waabi-green/20 mix-blend-multiply" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
              <h3 className="font-serif text-3xl md:text-4xl text-white mb-4">
                Book direct, pay less
              </h3>
              <p className="text-white/80 mb-8 max-w-md">
                Skip the OTA markup — book straight with us for the best rate,
                no hidden fees, and a WhatsApp line that actually replies.
              </p>
              <Link
                href="/booking"
                className="btn-primary border-none shadow-xl"
              >
                Check Availability <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Contact info card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="waabi-card bg-waabi-bg p-8 md:p-10 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-serif text-2xl mb-8 text-dark">Contact Info</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail size={18} className="text-waabi-green-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark/50 text-xs uppercase tracking-wider mb-1 font-bold">
                      Email
                    </p>
                    <a
                      href="mailto:bookingcalcuttabackpackers@gmail.com"
                      className="text-sm text-dark font-medium hover:text-waabi-green-dark transition-colors break-all"
                    >
                      bookingcalcuttabackpackers@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-waabi-green-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark/50 text-xs uppercase tracking-wider mb-1 font-bold">
                      Phone / WhatsApp
                    </p>
                    <a
                      href="tel:+919875432441"
                      className="text-sm text-dark font-medium hover:text-waabi-green-dark transition-colors"
                    >
                      +91 98754 32441
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-waabi-green-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark/50 text-xs uppercase tracking-wider mb-1 font-bold">
                      Location
                    </p>
                    <p className="text-sm text-dark font-medium">
                      6/27a, Pashupati Bhattacharya Road, Kolkata 700034
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-waabi-green-dark mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-dark/50 text-xs uppercase tracking-wider mb-1 font-bold">
                      Check-in / Check-out
                    </p>
                    <p className="text-sm text-dark font-medium">2:00 PM / 11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/checkin"
              className="btn-outline mt-10 w-full"
            >
              Web Check-In
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
